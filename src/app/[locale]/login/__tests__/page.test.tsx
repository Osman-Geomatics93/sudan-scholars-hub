import { render, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import LoginPage from '../page';

// Override the global mocks for these tests
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockUseSession = useSession as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;
const mockUseSearchParams = useSearchParams as jest.Mock;

describe('LoginPage', () => {
  const mockReplace = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default router mock
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      prefetch: jest.fn(),
      back: jest.fn(),
    });

    // Default pathname (English locale)
    mockUsePathname.mockReturnValue('/en/login');

    // Default search params (no callback URL)
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  describe('Loading State', () => {
    it('should show loading spinner when auth status is loading', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
      });

      render(<LoginPage />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should show Arabic loading text for Arabic locale', () => {
      mockUsePathname.mockReturnValue('/ar/login');
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
      });

      render(<LoginPage />);

      expect(screen.getByText('جاري التحميل...')).toBeInTheDocument();
    });
  });

  describe('Authenticated User Redirect', () => {
    it('should redirect authenticated user to home page', async () => {
      mockUseSession.mockReturnValue({
        data: {
          user: { name: 'Test User', email: 'test@example.com' },
        },
        status: 'authenticated',
      });

      render(<LoginPage />);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/en');
      });
    });

    it('should redirect to callback URL when provided', async () => {
      mockUseSearchParams.mockReturnValue(
        new URLSearchParams('callbackUrl=/en/scholarships')
      );
      mockUseSession.mockReturnValue({
        data: {
          user: { name: 'Test User', email: 'test@example.com' },
        },
        status: 'authenticated',
      });

      render(<LoginPage />);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/en/scholarships');
      });
    });

    it('should show loading state while redirecting authenticated user', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: { name: 'Test User', email: 'test@example.com' },
        },
        status: 'authenticated',
      });

      render(<LoginPage />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not show login form for authenticated users', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: { name: 'Test User', email: 'test@example.com' },
        },
        status: 'authenticated',
      });

      render(<LoginPage />);

      expect(screen.queryByText('Continue with Google')).not.toBeInTheDocument();
      expect(screen.queryByText('Welcome')).not.toBeInTheDocument();
    });
  });

  describe('Unauthenticated User', () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });
    });

    it('should show login form for unauthenticated users', () => {
      render(<LoginPage />);

      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    });

    it('should show Arabic content for Arabic locale', () => {
      mockUsePathname.mockReturnValue('/ar/login');

      render(<LoginPage />);

      expect(screen.getByText('مرحباً بك')).toBeInTheDocument();
      expect(screen.getByText('تسجيل الدخول باستخدام Google')).toBeInTheDocument();
    });

    it('should not redirect unauthenticated users', () => {
      render(<LoginPage />);

      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('should show Browse as Guest link', () => {
      render(<LoginPage />);

      expect(screen.getByText('Browse as Guest')).toBeInTheDocument();
    });

    it('should show Admin Login link', () => {
      render(<LoginPage />);

      expect(screen.getByText('Admin Login')).toBeInTheDocument();
    });

    it('should show terms and privacy text', () => {
      render(<LoginPage />);

      expect(
        screen.getByText(/By signing in, you agree to our Terms of Service/)
      ).toBeInTheDocument();
    });
  });

  describe('Callback URL Handling', () => {
    it('should use locale as default callback URL when none provided', async () => {
      mockUseSession.mockReturnValue({
        data: {
          user: { name: 'Test User', email: 'test@example.com' },
        },
        status: 'authenticated',
      });
      mockUseSearchParams.mockReturnValue(new URLSearchParams());

      render(<LoginPage />);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/en');
      });
    });

    it('should use Arabic locale as default for Arabic path', async () => {
      mockUsePathname.mockReturnValue('/ar/login');
      mockUseSession.mockReturnValue({
        data: {
          user: { name: 'Test User', email: 'test@example.com' },
        },
        status: 'authenticated',
      });
      mockUseSearchParams.mockReturnValue(new URLSearchParams());

      render(<LoginPage />);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/ar');
      });
    });

    it('should preserve complex callback URLs', async () => {
      mockUseSearchParams.mockReturnValue(
        new URLSearchParams('callbackUrl=/en/loi-builder?step=2')
      );
      mockUseSession.mockReturnValue({
        data: {
          user: { name: 'Test User', email: 'test@example.com' },
        },
        status: 'authenticated',
      });

      render(<LoginPage />);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/en/loi-builder?step=2');
      });
    });
  });
});
