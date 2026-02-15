// ============================
// IELTS/TOEFL Seed Data
// 3 Reading Tests + Writing/Listening/Speaking prompts + 200+ Vocab
// ============================

export const SEED_TESTS = [
  // ========== IELTS ACADEMIC READING ==========
  {
    examType: "ielts",
    section: "reading",
    title: "IELTS Academic Reading — Climate Science & Urban Planning",
    description: "Two academic passages covering climate change research and urban sustainability.",
    difficulty: "medium",
    timeMinutes: 60,
    isOfficial: true,
    content: {
      passages: [
        {
          title: "The Impact of Climate Change on Global Agriculture",
          text: `Climate change poses one of the most significant threats to global food security in the twenty-first century. Rising temperatures, changing precipitation patterns, and increased frequency of extreme weather events are already affecting agricultural productivity worldwide. According to research published by the Intergovernmental Panel on Climate Change (IPCC), crop yields could decline by up to 25 percent by 2050 if current trends continue unabated.

The effects of climate change on agriculture are not uniform across the globe. Tropical regions, which are home to many developing nations, are expected to bear the brunt of these changes. In sub-Saharan Africa, for instance, maize yields could decrease by 20 percent, threatening the livelihoods of millions of smallholder farmers. Conversely, some northern latitude countries may experience temporary increases in productivity due to longer growing seasons and the ability to cultivate previously unsuitable land.

Water availability is perhaps the most critical factor linking climate change to agricultural output. The World Bank estimates that by 2030, water demand will exceed supply by 40 percent in many regions. Irrigation-dependent agriculture, which accounts for roughly 70 percent of global freshwater withdrawals, will be particularly vulnerable. Groundwater depletion in major agricultural regions such as the Indo-Gangetic Plain and the Central Valley of California is already accelerating beyond sustainable rates.

Adaptation strategies range from the development of drought-resistant crop varieties through genetic modification to the implementation of precision agriculture techniques that optimize water and fertilizer use. Some researchers advocate for a fundamental shift in dietary patterns, arguing that reducing meat consumption could free up significant agricultural resources. Others point to the potential of vertical farming and controlled environment agriculture as ways to decouple food production from climate variability.

The economic implications are staggering. The Food and Agriculture Organization (FAO) estimates that climate change could push an additional 122 million people into extreme poverty by 2030, primarily through its effects on agriculture. Developing nations, which contribute least to greenhouse gas emissions, face the greatest risks, raising important questions about climate justice and international responsibility.`,
          questions: [
            { question: "According to the IPCC, crop yields could decline by what percentage by 2050?", options: ["10%", "15%", "25%", "40%"], correct: "C", type: "multiple_choice" },
            { question: "Which region is expected to suffer the most from climate change effects on agriculture?", options: ["Northern Europe", "Tropical regions", "North America", "East Asia"], correct: "B", type: "multiple_choice" },
            { question: "What percentage of global freshwater withdrawals does irrigation account for?", options: ["40%", "50%", "60%", "70%"], correct: "D", type: "multiple_choice" },
            { question: "The passage states that some northern countries may benefit from climate change in agriculture.", options: ["True", "False", "Not Given"], correct: "A", type: "true_false_ng" },
            { question: "Genetic modification is the only viable adaptation strategy mentioned.", options: ["True", "False", "Not Given"], correct: "B", type: "true_false_ng" },
            { question: "The FAO estimates climate change could push ___ million more people into extreme poverty.", options: ["80", "100", "122", "150"], correct: "C", type: "multiple_choice" },
            { question: "Water demand will exceed supply by 40% by 2030 according to which organization?", options: ["IPCC", "FAO", "World Bank", "WHO"], correct: "C", type: "multiple_choice" },
          ]
        },
        {
          title: "Urban Green Spaces and Public Health",
          text: `The relationship between urban green spaces and public health has attracted increasing scholarly attention over the past two decades. As more than half of the world's population now lives in cities, understanding how urban environments affect physical and mental well-being has become a priority for researchers, urban planners, and policymakers alike.

Numerous studies have demonstrated a positive correlation between access to green spaces and various health outcomes. A landmark study conducted in the Netherlands, involving over 250,000 participants, found that people living within one kilometer of green spaces reported fewer health complaints, particularly relating to mental health conditions such as anxiety and depression. Similarly, research from Japan has shown that "forest bathing" (shinrin-yoku), the practice of spending time in forested areas, leads to measurable reductions in cortisol levels and blood pressure.

The mechanisms through which green spaces promote health are multifaceted. Physical activity is an obvious pathway; parks and green corridors encourage walking, cycling, and recreational exercise. However, the benefits extend beyond mere physical activity. Green spaces help mitigate the urban heat island effect, improve air quality by filtering pollutants, and reduce noise pollution. Perhaps most importantly, they provide opportunities for social interaction and community building, factors that are strongly associated with psychological well-being.

Despite the evidence, access to green spaces remains highly inequitable. Research in the United States has consistently shown that low-income neighborhoods and communities of color have significantly less access to parks and green spaces than more affluent areas. This environmental injustice contributes to health disparities that perpetuate cycles of disadvantage.

Several cities have begun implementing innovative solutions to address this imbalance. Singapore's "City in a Garden" initiative has transformed the city-state into one of the greenest urban environments in the world, with over 300 kilometers of park connectors. Barcelona's "superblocks" program reclaims street space from vehicles to create community-oriented green areas. These examples demonstrate that with political will and thoughtful planning, cities can be redesigned to prioritize human health and environmental sustainability.`,
          questions: [
            { question: "How many participants were in the Netherlands green space study?", options: ["50,000", "100,000", "250,000", "500,000"], correct: "C", type: "multiple_choice" },
            { question: "Shinrin-yoku is a practice originating from which country?", options: ["China", "Japan", "Korea", "Thailand"], correct: "B", type: "multiple_choice" },
            { question: "Green spaces help reduce the urban ___ island effect.", options: ["noise", "heat", "light", "waste"], correct: "B", type: "multiple_choice" },
            { question: "Low-income neighborhoods in the US have equal access to green spaces as wealthy areas.", options: ["True", "False", "Not Given"], correct: "B", type: "true_false_ng" },
            { question: "Singapore has over 300 kilometers of park connectors.", options: ["True", "False", "Not Given"], correct: "A", type: "true_false_ng" },
            { question: "Barcelona's program is called ___.", options: ["green blocks", "superblocks", "eco-zones", "garden blocks"], correct: "B", type: "multiple_choice" },
            { question: "The passage suggests green spaces only benefit physical health.", options: ["True", "False", "Not Given"], correct: "B", type: "true_false_ng" },
          ]
        }
      ]
    }
  },

  // ========== IELTS GENERAL READING ==========
  {
    examType: "ielts",
    section: "reading",
    title: "IELTS General Training Reading — Workplace & Education",
    description: "Passages covering workplace communication and educational technology.",
    difficulty: "easy",
    timeMinutes: 60,
    isOfficial: true,
    content: {
      passages: [
        {
          title: "Effective Workplace Communication",
          text: `Good communication is the foundation of any successful organization. Whether you are sending an email, presenting at a meeting, or having a casual conversation with a colleague, the way you communicate can significantly impact your professional relationships and career progression.

Written communication in the workplace has evolved considerably with the rise of digital technology. Email remains the most common form of business communication, with the average office worker sending and receiving approximately 120 emails per day. However, the convenience of email has led to a phenomenon known as "email overload," where employees spend a disproportionate amount of time managing their inboxes rather than engaging in productive work.

To combat this, many organizations have adopted instant messaging platforms such as Slack and Microsoft Teams. These tools allow for quicker, more informal exchanges that can reduce the volume of emails. Nevertheless, they come with their own challenges, including the expectation of immediate responses and the blurring of boundaries between work and personal time.

Regardless of the medium, several principles of effective workplace communication remain constant. Clarity is paramount: messages should be concise, well-structured, and free of jargon that the recipient may not understand. Active listening, which involves fully concentrating on what is being said rather than merely hearing the words, is equally important. Finally, cultural sensitivity is crucial in today's globalized workplace, where colleagues may come from diverse linguistic and cultural backgrounds.

Managers play a particularly important role in fostering effective communication. Regular team meetings, open-door policies, and constructive feedback sessions can create an environment where employees feel comfortable sharing ideas and concerns. Research shows that organizations with strong communication practices are 50 percent more likely to report lower employee turnover.`,
          questions: [
            { question: "How many emails does the average office worker handle per day?", options: ["80", "100", "120", "150"], correct: "C", type: "multiple_choice" },
            { question: "Which of the following is NOT mentioned as an instant messaging platform?", options: ["Slack", "Microsoft Teams", "WhatsApp", "All are mentioned"], correct: "C", type: "multiple_choice" },
            { question: "Organizations with strong communication are ___ percent more likely to have lower turnover.", options: ["25", "35", "50", "75"], correct: "C", type: "multiple_choice" },
            { question: "Email overload refers to spending too much time managing inboxes.", options: ["True", "False", "Not Given"], correct: "A", type: "true_false_ng" },
            { question: "Instant messaging has completely replaced email in most companies.", options: ["True", "False", "Not Given"], correct: "B", type: "true_false_ng" },
            { question: "Active listening means fully concentrating on what is being said.", options: ["True", "False", "Not Given"], correct: "A", type: "true_false_ng" },
          ]
        },
        {
          title: "Online Learning in the Modern Era",
          text: `The COVID-19 pandemic accelerated the adoption of online learning across the globe at an unprecedented rate. What was once considered an alternative or supplementary form of education quickly became the primary mode of instruction for millions of students. While the initial transition was challenging, the experience has fundamentally reshaped how we think about education and its delivery.

Online learning offers several distinct advantages. Flexibility is chief among them: students can access course materials and complete assignments at times that suit their individual schedules. This is particularly beneficial for working professionals and those with family responsibilities. Geographic barriers are also eliminated, allowing students in remote areas to access educational resources that were previously unavailable to them.

However, online learning is not without its drawbacks. The lack of face-to-face interaction can lead to feelings of isolation and disengagement. Students who struggle with self-discipline may find it difficult to stay motivated without the structure of a traditional classroom. Technical issues, including unreliable internet connections and limited access to devices, can also hinder the learning experience, particularly in developing countries.

Educators have responded to these challenges by developing more interactive and engaging online content. Video conferencing tools enable real-time discussions, while gamification elements such as quizzes, leaderboards, and badges help maintain student motivation. Learning management systems have become increasingly sophisticated, offering analytics that allow instructors to track student progress and identify those who may be falling behind.

Looking ahead, most experts predict that the future of education will be a hybrid model that combines the best elements of both online and in-person learning. This blended approach has the potential to make education more accessible, personalized, and effective than ever before.`,
          questions: [
            { question: "What event accelerated the adoption of online learning?", options: ["Financial crisis", "COVID-19 pandemic", "Technology boom", "Education reform"], correct: "B", type: "multiple_choice" },
            { question: "Which is listed as an advantage of online learning?", options: ["More social interaction", "Flexibility", "Lower costs", "Better grades"], correct: "B", type: "multiple_choice" },
            { question: "Gamification elements mentioned include quizzes, leaderboards, and ___.", options: ["certificates", "badges", "prizes", "rewards"], correct: "B", type: "multiple_choice" },
            { question: "Online learning eliminates geographic barriers.", options: ["True", "False", "Not Given"], correct: "A", type: "true_false_ng" },
            { question: "All experts agree that online learning is better than classroom learning.", options: ["True", "False", "Not Given"], correct: "B", type: "true_false_ng" },
            { question: "The passage suggests the future will likely involve a hybrid model.", options: ["True", "False", "Not Given"], correct: "A", type: "true_false_ng" },
            { question: "Online learning is equally accessible in all countries.", options: ["True", "False", "Not Given"], correct: "B", type: "true_false_ng" },
          ]
        }
      ]
    }
  },

  // ========== TOEFL READING ==========
  {
    examType: "toefl",
    section: "reading",
    title: "TOEFL Reading — Space Exploration & Linguistics",
    description: "Academic passages on space technology and language evolution.",
    difficulty: "medium",
    timeMinutes: 54,
    isOfficial: true,
    content: {
      passages: [
        {
          title: "The Future of Space Exploration",
          text: `The landscape of space exploration has undergone a dramatic transformation in the early twenty-first century. Once the exclusive domain of government agencies like NASA and Roscosmos, space has increasingly become accessible to private companies. SpaceX, Blue Origin, and other commercial entities have developed reusable rocket technology that has significantly reduced the cost of launching payloads into orbit.

The development of reusable rockets represents perhaps the most important advancement in space technology since the Space Shuttle program. SpaceX's Falcon 9 rocket, which first successfully landed its booster stage in 2015, has been reflown dozens of times. This reusability has reduced launch costs from approximately $54,500 per kilogram to orbit to less than $2,720 per kilogram, making space more accessible for scientific research, telecommunications, and even tourism.

Mars has emerged as the next major frontier. Multiple space agencies and private companies have announced plans for crewed missions to Mars within the coming decades. NASA's Artemis program aims to return humans to the Moon as a stepping stone for future Mars missions. SpaceX has been developing its Starship vehicle specifically for Mars colonization, with the ambitious goal of establishing a self-sustaining colony.

Beyond Mars, scientists are exploring more distant targets. The Europa Clipper mission will investigate Jupiter's moon Europa, which is believed to harbor a vast subsurface ocean that could potentially support life. Similarly, the Dragonfly mission to Saturn's moon Titan will search for prebiotic chemistry and signs of biological activity.

Space exploration also drives technological innovation on Earth. Technologies originally developed for space applications, including memory foam, scratch-resistant lenses, and water purification systems, have found widespread civilian applications. This "spin-off" effect provides an economic justification for continued investment in space research, alongside the scientific and inspirational value of exploring the cosmos.`,
          questions: [
            { question: "What is the main idea of the passage?", options: ["Government agencies are failing at space exploration", "Space exploration is evolving through private sector involvement and new technologies", "Mars colonization will happen by 2030", "Space tourism is the future"], correct: "B", type: "multiple_choice" },
            { question: "According to the passage, SpaceX's Falcon 9 first landed its booster in what year?", options: ["2010", "2012", "2015", "2018"], correct: "C", type: "multiple_choice" },
            { question: "The current launch cost per kilogram has been reduced to approximately:", options: ["$54,500", "$10,000", "$5,000", "$2,720"], correct: "D", type: "multiple_choice" },
            { question: "Which moon is believed to have a subsurface ocean?", options: ["Titan", "Europa", "Ganymede", "Io"], correct: "B", type: "multiple_choice" },
            { question: "The word 'harbor' in paragraph 4 is closest in meaning to:", options: ["protect", "contain", "hide", "create"], correct: "B", type: "vocabulary" },
            { question: "Which is NOT mentioned as a space spin-off technology?", options: ["Memory foam", "Scratch-resistant lenses", "Solar panels", "Water purification"], correct: "C", type: "multiple_choice" },
            { question: "What can be inferred about the author's attitude toward space exploration?", options: ["Skeptical", "Neutral", "Generally supportive", "Opposed"], correct: "C", type: "inference" },
          ]
        },
        {
          title: "The Evolution of Human Language",
          text: `The origins of human language remain one of the most enduring mysteries in scientific research. Unlike other aspects of human evolution, language leaves no direct fossil record. Researchers must rely on indirect evidence from archaeology, genetics, comparative anatomy, and the study of existing languages to piece together how this uniquely human capacity emerged.

Current estimates suggest that language in its modern form developed between 50,000 and 100,000 years ago, coinciding with a period of rapid cultural advancement known as the "Great Leap Forward." During this period, early humans began producing sophisticated tools, creating cave art, and engaging in long-distance trade, all activities that likely required complex communication.

The biological prerequisites for language are equally fascinating. The FOXP2 gene, sometimes called the "language gene," plays a crucial role in the development of speech and language abilities. Mutations in this gene result in severe speech disorders. Comparative studies show that the human version of FOXP2 differs from that of our closest relatives, chimpanzees, by just two amino acids, yet this small genetic change appears to have had profound effects on our ability to produce and process speech.

Beyond genetics, anatomical changes were necessary for speech production. The descent of the human larynx, which occurs during the first years of life, creates a longer vocal tract that enables the production of a wider range of sounds. This anatomical configuration, while advantageous for speech, actually increases the risk of choking, suggesting that the evolutionary advantages of language outweighed this significant disadvantage.

Today, there are approximately 7,000 languages spoken worldwide, though this number is declining rapidly. Linguists estimate that one language dies approximately every two weeks. This loss of linguistic diversity represents not just the disappearance of words and grammar, but the erosion of unique ways of understanding and categorizing the human experience. Efforts to document and preserve endangered languages have intensified, but the forces of globalization continue to favor dominant languages at the expense of smaller ones.`,
          questions: [
            { question: "Why is studying the origin of language particularly difficult?", options: ["Language is too old to study", "Language leaves no direct fossil record", "Scientists are not interested", "We have too many languages"], correct: "B", type: "multiple_choice" },
            { question: "When did modern language likely develop?", options: ["10,000-20,000 years ago", "50,000-100,000 years ago", "200,000-300,000 years ago", "1 million years ago"], correct: "B", type: "multiple_choice" },
            { question: "The FOXP2 gene differs from chimpanzees by how many amino acids?", options: ["One", "Two", "Three", "Five"], correct: "B", type: "multiple_choice" },
            { question: "The descent of the human larynx increases the risk of:", options: ["hearing loss", "choking", "infection", "breathing problems"], correct: "B", type: "multiple_choice" },
            { question: "How often does a language die according to the passage?", options: ["Every day", "Every week", "Every two weeks", "Every month"], correct: "C", type: "multiple_choice" },
            { question: "The word 'enduring' in paragraph 1 is closest in meaning to:", options: ["painful", "lasting", "recent", "simple"], correct: "B", type: "vocabulary" },
            { question: "How many languages are currently spoken worldwide?", options: ["3,000", "5,000", "7,000", "10,000"], correct: "C", type: "multiple_choice" },
          ]
        }
      ]
    }
  },

  // ========== IELTS WRITING ==========
  {
    examType: "ielts",
    section: "writing",
    title: "IELTS Academic Writing — Task 1 & Task 2",
    description: "Graph description and essay writing tasks.",
    difficulty: "medium",
    timeMinutes: 60,
    isOfficial: true,
    content: {
      tasks: [
        {
          type: "task1",
          prompt: "The bar chart below shows the number of international students enrolled in universities in four different countries (USA, UK, Australia, Canada) from 2015 to 2023. Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
          minWords: 150,
          maxWords: 300,
        },
        {
          type: "task2",
          prompt: "Some people believe that universities should focus primarily on preparing students for employment, while others argue that the purpose of university education is to advance knowledge for its own sake. Discuss both views and give your own opinion. Write at least 250 words.",
          minWords: 250,
          maxWords: 500,
        }
      ]
    }
  },
  {
    examType: "ielts",
    section: "writing",
    title: "IELTS Writing — Technology & Society",
    description: "Writing tasks about the impact of technology on modern life.",
    difficulty: "medium",
    timeMinutes: 60,
    isOfficial: true,
    content: {
      tasks: [
        {
          type: "task1",
          prompt: "The table below shows the percentage of households with internet access in six different countries in 2010 and 2023. Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
          minWords: 150,
          maxWords: 300,
        },
        {
          type: "task2",
          prompt: "With the increasing use of artificial intelligence in the workplace, many people fear that a large number of jobs will be lost. To what extent do you agree or disagree with this view? Write at least 250 words.",
          minWords: 250,
          maxWords: 500,
        }
      ]
    }
  },

  // ========== TOEFL WRITING ==========
  {
    examType: "toefl",
    section: "writing",
    title: "TOEFL Writing — Integrated & Independent",
    description: "TOEFL integrated reading/listening summary and independent essay.",
    difficulty: "medium",
    timeMinutes: 50,
    isOfficial: true,
    content: {
      tasks: [
        {
          type: "integrated",
          prompt: "Read the following passage about renewable energy sources. The passage argues that solar energy is the most promising renewable energy source for the future. Summarize the points made in the passage, then explain how they relate to environmental sustainability. You have 20 minutes to plan and write your response. Write 150-225 words.",
          minWords: 150,
          maxWords: 225,
        },
        {
          type: "independent",
          prompt: "Do you agree or disagree with the following statement? Students learn more from teachers who are strict and demanding than from teachers who are patient and supportive. Use specific reasons and examples to support your answer. Write at least 300 words.",
          minWords: 300,
          maxWords: 500,
        }
      ]
    }
  },

  // ========== IELTS LISTENING ==========
  {
    examType: "ielts",
    section: "listening",
    title: "IELTS Listening — Campus Life & Academic Lecture",
    description: "Transcript-based listening practice covering university and academic topics.",
    difficulty: "medium",
    timeMinutes: 30,
    isOfficial: true,
    content: {
      transcript: `Section 1: University Accommodation Office

Receptionist: Good morning, Student Services. How can I help you?
Student: Hi, I'm looking for information about university accommodation for next semester.
Receptionist: Of course. Are you a first-year or returning student?
Student: I'm a second-year student. I lived in the dorms last year but I'm looking for something different.
Receptionist: Well, we have several options. For returning students, we have shared apartments, studio flats, and homestay arrangements.
Student: How much is a shared apartment?
Receptionist: The shared apartments are 450 pounds per month, which includes all utilities and internet. You'd share with two or three other students.
Student: And the studio flats?
Receptionist: Studios are 650 pounds per month. They're fully self-contained with your own kitchen and bathroom.
Student: What about the homestay option?
Receptionist: Homestay is 380 pounds per month and includes breakfast and dinner with a local family. It's very popular with international students.
Student: That sounds interesting. What's the deadline for applications?
Receptionist: The deadline is March 15th, but I'd recommend applying by March 1st as the popular options fill up quickly.

Section 2: Academic Lecture on Marine Biology

Professor: Today we'll be discussing coral reef ecosystems, which are among the most biodiverse environments on Earth. Coral reefs cover less than one percent of the ocean floor, yet they support approximately 25 percent of all marine species. This remarkable concentration of life has led scientists to call them the "rainforests of the sea."

The health of coral reefs is primarily determined by water temperature. Corals exist in a symbiotic relationship with microscopic algae called zooxanthellae, which live within the coral tissue and provide up to 90 percent of the coral's energy through photosynthesis. When water temperatures rise even one to two degrees Celsius above the normal summer maximum, corals expel these algae in a process known as "bleaching."

Mass bleaching events have become increasingly frequent. The Great Barrier Reef in Australia has experienced four mass bleaching events since 2016. If current warming trends continue, scientists predict that 90 percent of the world's coral reefs could be lost by 2050.

Conservation efforts include the establishment of marine protected areas, coral nurseries for reef restoration, and research into heat-resistant coral varieties. However, without significant reductions in greenhouse gas emissions, these efforts may ultimately prove insufficient.`,
      questions: [
        { question: "How much does a shared apartment cost per month?", options: ["£380", "£450", "£550", "£650"], correct: "B", type: "multiple_choice" },
        { question: "What is included in the shared apartment price?", options: ["Meals", "Utilities and internet", "Cleaning service", "Parking"], correct: "B", type: "multiple_choice" },
        { question: "How much is the homestay option per month?", options: ["£280", "£350", "£380", "£450"], correct: "C", type: "multiple_choice" },
        { question: "The application deadline is ___.", options: ["March 1st", "March 15th", "April 1st", "April 15th"], correct: "B", type: "multiple_choice" },
        { question: "What percentage of the ocean floor do coral reefs cover?", options: ["Less than 1%", "5%", "10%", "25%"], correct: "A", type: "multiple_choice" },
        { question: "Coral reefs support approximately ___ percent of all marine species.", options: ["10", "15", "20", "25"], correct: "D", type: "multiple_choice" },
        { question: "The microscopic algae in corals are called ___.", options: ["phytoplankton", "zooxanthellae", "diatoms", "cyanobacteria"], correct: "B", type: "multiple_choice" },
        { question: "How many mass bleaching events has the Great Barrier Reef had since 2016?", options: ["Two", "Three", "Four", "Five"], correct: "C", type: "multiple_choice" },
        { question: "What percentage of reefs could be lost by 2050?", options: ["50%", "70%", "80%", "90%"], correct: "D", type: "multiple_choice" },
        { question: "Zooxanthellae provide up to ___ percent of the coral's energy.", options: ["50", "70", "80", "90"], correct: "D", type: "multiple_choice" },
      ]
    }
  },

  // ========== TOEFL LISTENING ==========
  {
    examType: "toefl",
    section: "listening",
    title: "TOEFL Listening — Campus Conversation & Lecture",
    description: "Transcript-based TOEFL listening with academic lecture and conversation.",
    difficulty: "medium",
    timeMinutes: 30,
    isOfficial: true,
    content: {
      transcript: `Conversation: Student and Professor

Student: Professor Martinez, do you have a minute? I wanted to ask about the research paper assignment.
Professor: Sure, come in. What's on your mind?
Student: I'm having trouble narrowing down my topic. I want to write about renewable energy, but that seems too broad.
Professor: You're right, it is quite broad. What aspect of renewable energy interests you most?
Student: Well, I've been reading about how solar panel efficiency has improved over the years.
Professor: That's a great direction. You could focus specifically on the evolution of photovoltaic cell technology over the past decade. There have been some remarkable advances in perovskite solar cells.
Student: Perovskite? I'm not familiar with that.
Professor: They're a newer type of solar cell that can be manufactured much more cheaply than traditional silicon cells. Some researchers believe they could achieve efficiencies above 30 percent within a few years.
Student: That sounds perfect. How many sources should I use?
Professor: I'd recommend at least eight peer-reviewed sources. And remember, the paper should be between 3,000 and 4,000 words. The deadline is November 28th.

Lecture: Psychology — Memory and Learning

Today I want to talk about how memory works, specifically the relationship between working memory and long-term memory formation. Working memory, sometimes called short-term memory, has a very limited capacity. The psychologist George Miller famously described it as being able to hold seven, plus or minus two, items at a time. That's why phone numbers were traditionally seven digits long.

But here's what's interesting: we can expand our working memory through a process called "chunking." Instead of remembering individual letters like C, I, A, F, B, I, you can chunk them into meaningful groups: CIA and FBI. Now instead of six items, you only need to remember two.

For information to move from working memory to long-term memory, it needs to be encoded. The most effective encoding strategies involve elaborative rehearsal, where you connect new information to things you already know. Simply repeating information over and over, known as maintenance rehearsal, is far less effective.

Sleep also plays a critical role in memory consolidation. Research shows that students who sleep at least seven hours after studying retain approximately 20 percent more information than those who stay up all night cramming. This finding has important implications for how we should structure our study habits.`,
      questions: [
        { question: "What is the student's initial topic concern?", options: ["Too narrow", "Too broad", "Too boring", "Too difficult"], correct: "B", type: "multiple_choice" },
        { question: "What type of solar cell does the professor recommend as a focus?", options: ["Silicon", "Perovskite", "Organic", "Thin-film"], correct: "B", type: "multiple_choice" },
        { question: "How many peer-reviewed sources are recommended?", options: ["Five", "Six", "Eight", "Ten"], correct: "C", type: "multiple_choice" },
        { question: "The paper deadline is ___.", options: ["November 15th", "November 28th", "December 1st", "December 15th"], correct: "B", type: "multiple_choice" },
        { question: "According to Miller, working memory can hold how many items?", options: ["5 plus or minus 2", "7 plus or minus 2", "9 plus or minus 2", "10 plus or minus 2"], correct: "B", type: "multiple_choice" },
        { question: "What is the process of grouping information into meaningful units called?", options: ["Encoding", "Chunking", "Rehearsal", "Consolidation"], correct: "B", type: "multiple_choice" },
        { question: "Which type of rehearsal is more effective for long-term memory?", options: ["Maintenance rehearsal", "Simple repetition", "Elaborative rehearsal", "Rote learning"], correct: "C", type: "multiple_choice" },
        { question: "Students who sleep 7+ hours retain approximately ___ percent more information.", options: ["10", "15", "20", "25"], correct: "C", type: "multiple_choice" },
        { question: "The paper should be between ___ and ___ words.", options: ["2000-3000", "3000-4000", "4000-5000", "5000-6000"], correct: "B", type: "multiple_choice" },
        { question: "Why were phone numbers traditionally seven digits long?", options: ["Convention", "Working memory capacity", "Technical limitations", "Government regulation"], correct: "B", type: "multiple_choice" },
      ]
    }
  },

  // ========== IELTS SPEAKING ==========
  {
    examType: "ielts",
    section: "speaking",
    title: "IELTS Speaking — Education & Technology",
    description: "Three-part IELTS speaking test covering familiar topics and abstract discussion.",
    difficulty: "medium",
    timeMinutes: 15,
    isOfficial: true,
    content: {
      parts: [
        {
          partNumber: 1,
          prompt: "Let's talk about your studies. What are you studying at the moment? Why did you choose this subject? Do you enjoy studying? What do you find most challenging about your studies?",
          prepTimeSec: 0,
          responseTimeSec: 120,
        },
        {
          partNumber: 2,
          prompt: "Describe a piece of technology that you find very useful in your daily life. You should say: what it is, how often you use it, what you use it for, and explain why you find it so useful. You have 1 minute to prepare and should speak for 1-2 minutes.",
          prepTimeSec: 60,
          responseTimeSec: 120,
        },
        {
          partNumber: 3,
          prompt: "Let's discuss technology and society more broadly. How has technology changed the way people communicate? Do you think people are too dependent on technology? What technological developments do you think will have the biggest impact in the future? Should governments regulate how technology companies use personal data?",
          prepTimeSec: 0,
          responseTimeSec: 180,
        }
      ]
    }
  },

  // ========== TOEFL SPEAKING ==========
  {
    examType: "toefl",
    section: "speaking",
    title: "TOEFL Speaking — Independent & Integrated Tasks",
    description: "TOEFL speaking tasks covering personal opinion and academic topics.",
    difficulty: "medium",
    timeMinutes: 17,
    isOfficial: true,
    content: {
      parts: [
        {
          partNumber: 1,
          prompt: "Some people prefer to live in a large city, while others prefer to live in a small town or rural area. Which do you prefer and why? Include specific reasons and details in your response. You have 15 seconds to prepare and 45 seconds to speak.",
          prepTimeSec: 15,
          responseTimeSec: 45,
        },
        {
          partNumber: 2,
          prompt: "The university has announced that it will require all first-year students to live on campus. The student in the conversation disagrees with this policy. Summarize the student's opinion and explain the reasons they give for their position. You have 30 seconds to prepare and 60 seconds to speak.",
          prepTimeSec: 30,
          responseTimeSec: 60,
        },
        {
          partNumber: 3,
          prompt: "Using the examples from the lecture, explain the concept of 'anchoring bias' in behavioral economics and how it affects consumer decision-making. You have 20 seconds to prepare and 60 seconds to speak.",
          prepTimeSec: 20,
          responseTimeSec: 60,
        }
      ]
    }
  },

  // Additional writing prompts
  {
    examType: "ielts",
    section: "writing",
    title: "IELTS Writing — Environment & Globalization",
    description: "Writing tasks about environmental policy and cultural impacts of globalization.",
    difficulty: "hard",
    timeMinutes: 60,
    isOfficial: true,
    content: {
      tasks: [
        {
          type: "task1",
          prompt: "The pie charts below show the proportion of energy generated from different sources in Country X in 2000 and 2023. Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
          minWords: 150,
          maxWords: 300,
        },
        {
          type: "task2",
          prompt: "Some people argue that the increasing globalization of culture is a positive development, while others believe it leads to the loss of local traditions and identity. Discuss both views and give your own opinion. Write at least 250 words.",
          minWords: 250,
          maxWords: 500,
        }
      ]
    }
  },
  {
    examType: "toefl",
    section: "writing",
    title: "TOEFL Writing — Education & Health",
    description: "TOEFL writing tasks on educational policy and public health.",
    difficulty: "hard",
    timeMinutes: 50,
    isOfficial: true,
    content: {
      tasks: [
        {
          type: "integrated",
          prompt: "The reading passage discusses the benefits of standardized testing in education, while the lecture challenges each of the points made. Summarize the lecture's main arguments and explain how they cast doubt on the claims in the reading. Write 150-225 words.",
          minWords: 150,
          maxWords: 225,
        },
        {
          type: "independent",
          prompt: "Do you agree or disagree with the following statement? Governments should spend more money on improving public health than on building new hospitals. Use specific reasons and examples to support your answer. Write at least 300 words.",
          minWords: 300,
          maxWords: 500,
        }
      ]
    }
  },

  // Additional speaking
  {
    examType: "ielts",
    section: "speaking",
    title: "IELTS Speaking — Travel & Culture",
    description: "Speaking test covering travel experiences and cultural exchange.",
    difficulty: "easy",
    timeMinutes: 15,
    isOfficial: true,
    content: {
      parts: [
        {
          partNumber: 1,
          prompt: "Let's talk about travel. Do you enjoy traveling? Where was the last place you visited? Do you prefer traveling alone or with others? What kind of accommodation do you usually choose?",
          prepTimeSec: 0,
          responseTimeSec: 120,
        },
        {
          partNumber: 2,
          prompt: "Describe a country or city you would like to visit in the future. You should say: where it is, how you know about it, what you would like to do there, and explain why you want to visit this place. You have 1 minute to prepare and 1-2 minutes to speak.",
          prepTimeSec: 60,
          responseTimeSec: 120,
        },
        {
          partNumber: 3,
          prompt: "Let's discuss travel and cultural exchange. How does traveling abroad help people understand other cultures? Do you think tourism can have negative effects on local communities? How has international travel changed in the past few decades? Is it important for young people to travel abroad?",
          prepTimeSec: 0,
          responseTimeSec: 180,
        }
      ]
    }
  },
];

// ========== VOCABULARY BANK (200+ words) ==========
export const SEED_VOCAB = [
  // --- IELTS Academic Word List (100 words) ---
  { word: "analyze", definition: "To examine something in detail to understand it better", example: "Scientists analyze data to draw conclusions.", arabicMeaning: "يحلل", category: "ielts_academic", difficulty: "medium" },
  { word: "approach", definition: "A way of dealing with a situation or problem", example: "The new approach to teaching improved student performance.", arabicMeaning: "منهج / نهج", category: "ielts_academic", difficulty: "easy" },
  { word: "assess", definition: "To evaluate or estimate the nature, ability, or quality of something", example: "The teacher will assess your progress at the end of the term.", arabicMeaning: "يقيّم", category: "ielts_academic", difficulty: "medium" },
  { word: "assume", definition: "To accept something as true without proof", example: "We should not assume that everyone agrees.", arabicMeaning: "يفترض", category: "ielts_academic", difficulty: "easy" },
  { word: "authority", definition: "The power or right to give orders and enforce obedience", example: "The government has the authority to impose regulations.", arabicMeaning: "سلطة", category: "ielts_academic", difficulty: "easy" },
  { word: "beneficial", definition: "Resulting in good; favorable or advantageous", example: "Regular exercise is beneficial for mental health.", arabicMeaning: "مفيد", category: "ielts_academic", difficulty: "easy" },
  { word: "concept", definition: "An abstract idea or general notion", example: "The concept of democracy varies across cultures.", arabicMeaning: "مفهوم", category: "ielts_academic", difficulty: "easy" },
  { word: "consistent", definition: "Acting or done in the same way over time", example: "Consistent practice leads to improvement.", arabicMeaning: "ثابت / متسق", category: "ielts_academic", difficulty: "medium" },
  { word: "constitute", definition: "To be a part of a whole; to form or compose", example: "Women constitute 60% of the workforce.", arabicMeaning: "يشكّل", category: "ielts_academic", difficulty: "hard" },
  { word: "context", definition: "The circumstances that form the setting for an event or idea", example: "You need to understand the context of the statement.", arabicMeaning: "سياق", category: "ielts_academic", difficulty: "medium" },
  { word: "contribute", definition: "To give something in order to help achieve or provide something", example: "Many factors contribute to climate change.", arabicMeaning: "يساهم", category: "ielts_academic", difficulty: "easy" },
  { word: "controversy", definition: "Disagreement, typically when prolonged, public, and heated", example: "The policy caused considerable controversy.", arabicMeaning: "جدل", category: "ielts_academic", difficulty: "medium" },
  { word: "crucial", definition: "Of great importance; critical", example: "Education is crucial for economic development.", arabicMeaning: "حاسم", category: "ielts_academic", difficulty: "medium" },
  { word: "decline", definition: "To become smaller, fewer, or less; a decrease", example: "The population has declined by 10% over the decade.", arabicMeaning: "ينخفض / يتراجع", category: "ielts_academic", difficulty: "medium" },
  { word: "derive", definition: "To obtain something from a specified source", example: "Many English words derive from Latin.", arabicMeaning: "يستمد", category: "ielts_academic", difficulty: "hard" },
  { word: "distinct", definition: "Recognizably different in nature from something else", example: "The two species are quite distinct from each other.", arabicMeaning: "مميز / مختلف", category: "ielts_academic", difficulty: "medium" },
  { word: "domestic", definition: "Relating to the running of a home or to one's own country", example: "Domestic production has increased significantly.", arabicMeaning: "محلي", category: "ielts_academic", difficulty: "easy" },
  { word: "dominant", definition: "Most important, powerful, or influential", example: "English is the dominant language in international business.", arabicMeaning: "مهيمن", category: "ielts_academic", difficulty: "medium" },
  { word: "emerge", definition: "To move out of or away from something; to come into view", example: "New technologies emerge every year.", arabicMeaning: "يظهر / ينبثق", category: "ielts_academic", difficulty: "medium" },
  { word: "emphasis", definition: "Special importance given to something", example: "The report places emphasis on environmental protection.", arabicMeaning: "تأكيد / تركيز", category: "ielts_academic", difficulty: "medium" },
  { word: "ensure", definition: "To make certain that something happens", example: "We must ensure that all students have equal access.", arabicMeaning: "يضمن", category: "ielts_academic", difficulty: "easy" },
  { word: "equivalent", definition: "Equal in value, amount, function, or meaning", example: "One mile is roughly equivalent to 1.6 kilometers.", arabicMeaning: "مكافئ / معادل", category: "ielts_academic", difficulty: "medium" },
  { word: "establish", definition: "To set up on a permanent basis; to achieve permanent acceptance", example: "The university was established in 1850.", arabicMeaning: "يؤسس", category: "ielts_academic", difficulty: "easy" },
  { word: "evident", definition: "Plain or obvious; clearly seen or understood", example: "It is evident that more research is needed.", arabicMeaning: "واضح", category: "ielts_academic", difficulty: "medium" },
  { word: "factor", definition: "A circumstance or element contributing to a result", example: "Economic factors play a key role in migration.", arabicMeaning: "عامل", category: "ielts_academic", difficulty: "easy" },
  { word: "fluctuate", definition: "To rise and fall irregularly", example: "Oil prices fluctuate depending on global demand.", arabicMeaning: "يتذبذب", category: "ielts_academic", difficulty: "hard" },
  { word: "framework", definition: "A basic structure underlying a system or concept", example: "The legal framework protects workers' rights.", arabicMeaning: "إطار عمل", category: "ielts_academic", difficulty: "medium" },
  { word: "fundamental", definition: "Forming a necessary base or core; of central importance", example: "Freedom of speech is a fundamental right.", arabicMeaning: "أساسي / جوهري", category: "ielts_academic", difficulty: "medium" },
  { word: "generate", definition: "To cause something to arise or come about", example: "The project will generate new jobs in the region.", arabicMeaning: "يولّد / ينتج", category: "ielts_academic", difficulty: "medium" },
  { word: "hypothesis", definition: "A proposed explanation for a phenomenon, to be tested", example: "The hypothesis was tested through several experiments.", arabicMeaning: "فرضية", category: "ielts_academic", difficulty: "hard" },
  { word: "identify", definition: "To recognize or establish what something is", example: "Researchers identified several risk factors.", arabicMeaning: "يحدد / يتعرف على", category: "ielts_academic", difficulty: "easy" },
  { word: "impact", definition: "The effect or influence of one thing on another", example: "Technology has had a significant impact on education.", arabicMeaning: "تأثير", category: "ielts_academic", difficulty: "easy" },
  { word: "implement", definition: "To put a plan or decision into effect", example: "The government plans to implement new policies.", arabicMeaning: "ينفّذ", category: "ielts_academic", difficulty: "medium" },
  { word: "implication", definition: "A likely consequence of something", example: "The findings have important implications for future research.", arabicMeaning: "مضمون / تبعة", category: "ielts_academic", difficulty: "hard" },
  { word: "indicate", definition: "To point out or show", example: "The data indicate a rising trend in temperatures.", arabicMeaning: "يشير إلى", category: "ielts_academic", difficulty: "medium" },
  { word: "infrastructure", definition: "The basic physical systems of a country or organization", example: "Investment in infrastructure is essential for growth.", arabicMeaning: "بنية تحتية", category: "ielts_academic", difficulty: "medium" },
  { word: "inherent", definition: "Existing as a natural or permanent quality", example: "There are inherent risks in any investment.", arabicMeaning: "متأصل / كامن", category: "ielts_academic", difficulty: "hard" },
  { word: "initial", definition: "Existing or occurring at the beginning", example: "The initial results were promising.", arabicMeaning: "أولي", category: "ielts_academic", difficulty: "easy" },
  { word: "innovate", definition: "To introduce new methods, ideas, or products", example: "Companies must innovate to stay competitive.", arabicMeaning: "يبتكر", category: "ielts_academic", difficulty: "medium" },
  { word: "interpret", definition: "To explain the meaning of information or actions", example: "Scientists interpret the data in different ways.", arabicMeaning: "يفسّر", category: "ielts_academic", difficulty: "medium" },
  { word: "investigate", definition: "To carry out a systematic inquiry to discover facts", example: "Police are investigating the cause of the accident.", arabicMeaning: "يحقق", category: "ielts_academic", difficulty: "medium" },
  { word: "justify", definition: "To show or prove to be right or reasonable", example: "How can you justify such a large expenditure?", arabicMeaning: "يبرر", category: "ielts_academic", difficulty: "medium" },
  { word: "maintain", definition: "To cause or enable to continue; to keep in good condition", example: "It is important to maintain a healthy lifestyle.", arabicMeaning: "يحافظ على", category: "ielts_academic", difficulty: "easy" },
  { word: "methodology", definition: "A system of methods used in a particular field", example: "The research methodology was clearly described.", arabicMeaning: "منهجية", category: "ielts_academic", difficulty: "hard" },
  { word: "notion", definition: "A conception or belief about something", example: "The notion that money brings happiness is debatable.", arabicMeaning: "فكرة / مفهوم", category: "ielts_academic", difficulty: "medium" },
  { word: "obtain", definition: "To get or acquire something", example: "Students can obtain a scholarship through merit.", arabicMeaning: "يحصل على", category: "ielts_academic", difficulty: "easy" },
  { word: "occur", definition: "To happen or take place", example: "Earthquakes frequently occur in this region.", arabicMeaning: "يحدث", category: "ielts_academic", difficulty: "easy" },
  { word: "participate", definition: "To take part or become involved in an activity", example: "All students are encouraged to participate in discussions.", arabicMeaning: "يشارك", category: "ielts_academic", difficulty: "easy" },
  { word: "perceive", definition: "To become aware or conscious of something", example: "Different cultures perceive time differently.", arabicMeaning: "يدرك", category: "ielts_academic", difficulty: "hard" },
  { word: "phenomenon", definition: "A fact or situation that is observed to exist or happen", example: "Global warming is a well-documented phenomenon.", arabicMeaning: "ظاهرة", category: "ielts_academic", difficulty: "hard" },

  // --- TOEFL Academic Vocabulary (100 words) ---
  { word: "elaborate", definition: "To develop or present in detail", example: "Could you elaborate on your main argument?", arabicMeaning: "يوضح بالتفصيل", category: "toefl_academic", difficulty: "medium" },
  { word: "profound", definition: "Very great or intense; having deep meaning", example: "The discovery had a profound effect on medicine.", arabicMeaning: "عميق", category: "toefl_academic", difficulty: "medium" },
  { word: "advocate", definition: "To publicly recommend or support", example: "Many scientists advocate for renewable energy.", arabicMeaning: "يدافع عن / يؤيد", category: "toefl_academic", difficulty: "medium" },
  { word: "comprehensive", definition: "Complete and including everything that is necessary", example: "The report provides a comprehensive overview.", arabicMeaning: "شامل", category: "toefl_academic", difficulty: "medium" },
  { word: "contemporary", definition: "Living or occurring at the same time; modern", example: "Contemporary art challenges traditional aesthetics.", arabicMeaning: "معاصر", category: "toefl_academic", difficulty: "medium" },
  { word: "contradict", definition: "To deny the truth of a statement by asserting the opposite", example: "The new evidence contradicts the original theory.", arabicMeaning: "يناقض", category: "toefl_academic", difficulty: "medium" },
  { word: "convey", definition: "To communicate or make known", example: "Body language can convey emotions effectively.", arabicMeaning: "ينقل / يوصل", category: "toefl_academic", difficulty: "medium" },
  { word: "criteria", definition: "Standards by which something may be judged (plural of criterion)", example: "The selection criteria include academic performance.", arabicMeaning: "معايير", category: "toefl_academic", difficulty: "medium" },
  { word: "depict", definition: "To represent or show in a picture or story", example: "The painting depicts a rural landscape.", arabicMeaning: "يصور", category: "toefl_academic", difficulty: "medium" },
  { word: "deteriorate", definition: "To become progressively worse", example: "Air quality continues to deteriorate in major cities.", arabicMeaning: "يتدهور", category: "toefl_academic", difficulty: "hard" },
  { word: "devote", definition: "To give time, effort, or attention to a particular purpose", example: "She devoted her career to scientific research.", arabicMeaning: "يكرّس", category: "toefl_academic", difficulty: "medium" },
  { word: "diminish", definition: "To make or become less", example: "The effects of the drug diminish over time.", arabicMeaning: "يتضاءل", category: "toefl_academic", difficulty: "medium" },
  { word: "diverse", definition: "Showing a great deal of variety", example: "The university has a diverse student body.", arabicMeaning: "متنوع", category: "toefl_academic", difficulty: "easy" },
  { word: "dramatic", definition: "Sudden and striking; relating to drama", example: "There has been a dramatic increase in online shopping.", arabicMeaning: "مثير / كبير", category: "toefl_academic", difficulty: "easy" },
  { word: "duration", definition: "The time during which something continues", example: "The duration of the experiment was six months.", arabicMeaning: "مدة", category: "toefl_academic", difficulty: "medium" },
  { word: "empirical", definition: "Based on observation or experience rather than theory", example: "Empirical evidence supports the hypothesis.", arabicMeaning: "تجريبي", category: "toefl_academic", difficulty: "hard" },
  { word: "encounter", definition: "To unexpectedly experience or be faced with something", example: "Students may encounter difficulties during the exam.", arabicMeaning: "يواجه / يصادف", category: "toefl_academic", difficulty: "medium" },
  { word: "enhance", definition: "To intensify, increase, or improve the quality of", example: "Technology can enhance the learning experience.", arabicMeaning: "يعزز", category: "toefl_academic", difficulty: "medium" },
  { word: "erode", definition: "To gradually wear away or be worn away", example: "Wind and rain erode the soil over time.", arabicMeaning: "يتآكل", category: "toefl_academic", difficulty: "medium" },
  { word: "exaggerate", definition: "To represent something as being larger or more important than it really is", example: "The media tends to exaggerate negative events.", arabicMeaning: "يبالغ", category: "toefl_academic", difficulty: "medium" },
  { word: "excerpt", definition: "A short extract from a piece of writing or music", example: "The professor read an excerpt from the textbook.", arabicMeaning: "مقتطف", category: "toefl_academic", difficulty: "medium" },
  { word: "exempt", definition: "Free from an obligation or liability imposed on others", example: "Students under 18 are exempt from the fee.", arabicMeaning: "معفى", category: "toefl_academic", difficulty: "hard" },
  { word: "expedite", definition: "To make an action or process happen sooner or more quickly", example: "We need to expedite the approval process.", arabicMeaning: "يعجّل", category: "toefl_academic", difficulty: "hard" },
  { word: "exploit", definition: "To use a situation or resource for one's own advantage", example: "Companies exploit natural resources for profit.", arabicMeaning: "يستغل", category: "toefl_academic", difficulty: "medium" },
  { word: "facilitate", definition: "To make an action or process easier", example: "Technology facilitates communication across borders.", arabicMeaning: "يسهّل", category: "toefl_academic", difficulty: "medium" },
  { word: "feasible", definition: "Possible and practical to do easily", example: "Is it feasible to complete the project by Friday?", arabicMeaning: "ممكن / قابل للتنفيذ", category: "toefl_academic", difficulty: "hard" },
  { word: "foster", definition: "To encourage or promote the development of something", example: "Schools should foster creativity in students.", arabicMeaning: "يعزز / يرعى", category: "toefl_academic", difficulty: "medium" },
  { word: "hinder", definition: "To create difficulties, resulting in delay or obstruction", example: "Lack of funding can hinder scientific progress.", arabicMeaning: "يعيق", category: "toefl_academic", difficulty: "medium" },
  { word: "hypothesis", definition: "A supposition made as a starting point for investigation", example: "The researcher tested her hypothesis with experiments.", arabicMeaning: "فرضية", category: "toefl_academic", difficulty: "medium" },
  { word: "illustrate", definition: "To explain or make something clear by giving examples", example: "The graph illustrates the trend over five years.", arabicMeaning: "يوضح", category: "toefl_academic", difficulty: "easy" },
  { word: "immense", definition: "Extremely large or great", example: "The immense size of the universe is hard to comprehend.", arabicMeaning: "هائل", category: "toefl_academic", difficulty: "medium" },
  { word: "incentive", definition: "Something that motivates or encourages one to do something", example: "Tax breaks serve as an incentive for businesses.", arabicMeaning: "حافز", category: "toefl_academic", difficulty: "medium" },
  { word: "incorporate", definition: "To take in or include as part of a whole", example: "The new design incorporates sustainable materials.", arabicMeaning: "يدمج", category: "toefl_academic", difficulty: "medium" },
  { word: "inevitable", definition: "Certain to happen; unavoidable", example: "Some degree of conflict is inevitable in any organization.", arabicMeaning: "حتمي", category: "toefl_academic", difficulty: "medium" },
  { word: "infer", definition: "To deduce or conclude from evidence and reasoning", example: "We can infer from the data that sales are declining.", arabicMeaning: "يستنتج", category: "toefl_academic", difficulty: "medium" },
  { word: "innovative", definition: "Featuring new methods; advanced and original", example: "The company is known for its innovative products.", arabicMeaning: "مبتكر", category: "toefl_academic", difficulty: "easy" },
  { word: "integrate", definition: "To combine one thing with another to form a whole", example: "The school integrates technology into the curriculum.", arabicMeaning: "يدمج", category: "toefl_academic", difficulty: "medium" },
  { word: "intensify", definition: "To become or make more intense", example: "The debate is expected to intensify in the coming weeks.", arabicMeaning: "يكثّف", category: "toefl_academic", difficulty: "medium" },
  { word: "legitimate", definition: "Conforming to the law or to rules; valid", example: "The company has a legitimate claim to the patent.", arabicMeaning: "شرعي / مشروع", category: "toefl_academic", difficulty: "medium" },
  { word: "manipulate", definition: "To control or influence cleverly or unscrupulously", example: "Scientists manipulate variables to test hypotheses.", arabicMeaning: "يتلاعب / يتحكم", category: "toefl_academic", difficulty: "medium" },
  { word: "marginalize", definition: "To treat a person or group as insignificant", example: "Policies should not marginalize vulnerable communities.", arabicMeaning: "يهمّش", category: "toefl_academic", difficulty: "hard" },
  { word: "mediate", definition: "To intervene between parties to resolve a dispute", example: "The UN attempted to mediate the conflict.", arabicMeaning: "يتوسط", category: "toefl_academic", difficulty: "hard" },
  { word: "mitigate", definition: "To make less severe, serious, or painful", example: "Trees help mitigate the effects of air pollution.", arabicMeaning: "يخفف", category: "toefl_academic", difficulty: "hard" },
  { word: "modify", definition: "To make partial or minor changes to something", example: "The plan was modified to address safety concerns.", arabicMeaning: "يعدّل", category: "toefl_academic", difficulty: "easy" },
  { word: "negligible", definition: "So small or unimportant as to be not worth considering", example: "The difference in test scores was negligible.", arabicMeaning: "لا يُذكر", category: "toefl_academic", difficulty: "hard" },
  { word: "objective", definition: "Not influenced by personal feelings; a goal or aim", example: "The objective of the study was to measure effectiveness.", arabicMeaning: "هدف / موضوعي", category: "toefl_academic", difficulty: "easy" },
  { word: "paradigm", definition: "A typical example or pattern of something; a model", example: "The internet created a new paradigm for communication.", arabicMeaning: "نموذج / نمط", category: "toefl_academic", difficulty: "hard" },
  { word: "persistent", definition: "Continuing firmly in an opinion or course of action", example: "Persistent effort leads to success.", arabicMeaning: "مثابر / مستمر", category: "toefl_academic", difficulty: "medium" },
  { word: "phenomenon", definition: "A fact or situation that is observed to exist", example: "Climate change is a global phenomenon.", arabicMeaning: "ظاهرة", category: "toefl_academic", difficulty: "medium" },
  { word: "plausible", definition: "Seeming reasonable or probable", example: "The explanation seems plausible.", arabicMeaning: "معقول / محتمل", category: "toefl_academic", difficulty: "hard" },

  // --- General Academic Vocabulary (50+ words) ---
  { word: "abstract", definition: "Existing in thought or as an idea but not having a physical existence", example: "Justice is an abstract concept.", arabicMeaning: "مجرد", category: "general", difficulty: "medium" },
  { word: "accumulate", definition: "To gather together or acquire an increasing quantity", example: "Wealth tends to accumulate over generations.", arabicMeaning: "يتراكم", category: "general", difficulty: "medium" },
  { word: "adapt", definition: "To adjust to new conditions or make suitable for a new purpose", example: "Animals adapt to their environments over time.", arabicMeaning: "يتكيّف", category: "general", difficulty: "easy" },
  { word: "adequate", definition: "Sufficient for a specific need or requirement", example: "The funding was adequate for the project.", arabicMeaning: "كافٍ", category: "general", difficulty: "medium" },
  { word: "ambiguous", definition: "Open to more than one interpretation; unclear", example: "The instructions were ambiguous and confusing.", arabicMeaning: "غامض", category: "general", difficulty: "hard" },
  { word: "analogy", definition: "A comparison between things for the purpose of explanation", example: "The teacher used an analogy to explain the concept.", arabicMeaning: "تشبيه / قياس", category: "general", difficulty: "hard" },
  { word: "attribute", definition: "To regard something as being caused by; a quality or feature", example: "Success can be attributed to hard work.", arabicMeaning: "يُنسب / صفة", category: "general", difficulty: "medium" },
  { word: "bias", definition: "Inclination or prejudice for or against something", example: "The study aims to eliminate researcher bias.", arabicMeaning: "تحيز", category: "general", difficulty: "medium" },
  { word: "coherent", definition: "Logical and consistent; united as a whole", example: "The essay presented a coherent argument.", arabicMeaning: "متماسك", category: "general", difficulty: "medium" },
  { word: "compile", definition: "To produce something by assembling information from various sources", example: "The researcher compiled data from multiple studies.", arabicMeaning: "يجمّع", category: "general", difficulty: "medium" },
  { word: "complement", definition: "A thing that completes or brings to perfection", example: "Theory and practice complement each other.", arabicMeaning: "يكمّل", category: "general", difficulty: "medium" },
  { word: "compliance", definition: "The act of conforming to a rule or standard", example: "The company ensured compliance with safety regulations.", arabicMeaning: "امتثال", category: "general", difficulty: "hard" },
  { word: "conceive", definition: "To form or devise a plan or idea in the mind", example: "It is hard to conceive of a world without technology.", arabicMeaning: "يتصور", category: "general", difficulty: "hard" },
  { word: "concurrent", definition: "Existing, happening, or done at the same time", example: "The two events ran on concurrent schedules.", arabicMeaning: "متزامن", category: "general", difficulty: "hard" },
  { word: "confine", definition: "To keep or restrict within certain limits", example: "The discussion was confined to environmental issues.", arabicMeaning: "يحصر / يقيّد", category: "general", difficulty: "medium" },
  { word: "consensus", definition: "General agreement among a group of people", example: "There is a scientific consensus on climate change.", arabicMeaning: "إجماع", category: "general", difficulty: "medium" },
  { word: "constraint", definition: "A limitation or restriction", example: "Budget constraints limited the scope of the project.", arabicMeaning: "قيد", category: "general", difficulty: "medium" },
  { word: "correlate", definition: "To have a mutual relationship or connection", example: "Education levels correlate with income.", arabicMeaning: "يرتبط", category: "general", difficulty: "hard" },
  { word: "credible", definition: "Able to be believed; convincing", example: "The witness provided a credible account of events.", arabicMeaning: "موثوق", category: "general", difficulty: "medium" },
  { word: "criterion", definition: "A standard by which something may be judged (singular of criteria)", example: "Price is an important criterion when choosing a supplier.", arabicMeaning: "معيار", category: "general", difficulty: "hard" },
  { word: "deficit", definition: "The amount by which something is too small; a shortage", example: "The country faces a budget deficit.", arabicMeaning: "عجز", category: "general", difficulty: "medium" },
  { word: "demographic", definition: "Relating to the structure of populations", example: "Demographic changes affect the labor market.", arabicMeaning: "ديموغرافي", category: "general", difficulty: "medium" },
  { word: "denote", definition: "To be a sign of; to indicate", example: "Red often denotes danger or urgency.", arabicMeaning: "يدل على", category: "general", difficulty: "hard" },
  { word: "disparity", definition: "A great difference between things", example: "Income disparity has increased in recent decades.", arabicMeaning: "تفاوت", category: "general", difficulty: "hard" },
  { word: "dynamic", definition: "Characterized by constant change or progress", example: "The business environment is highly dynamic.", arabicMeaning: "ديناميكي / متحرك", category: "general", difficulty: "medium" },
  { word: "elicit", definition: "To evoke or draw out a response or answer", example: "The question elicited a strong reaction from the audience.", arabicMeaning: "يستخرج / يستدعي", category: "general", difficulty: "hard" },
  { word: "empirical", definition: "Based on observation rather than theory or pure logic", example: "The claim is supported by empirical evidence.", arabicMeaning: "تجريبي", category: "general", difficulty: "hard" },
  { word: "enable", definition: "To give someone the ability or means to do something", example: "The scholarship will enable her to pursue her studies.", arabicMeaning: "يمكّن", category: "general", difficulty: "easy" },
  { word: "endeavor", definition: "An attempt to achieve a goal; to try hard", example: "Scientific endeavor has transformed our understanding.", arabicMeaning: "مسعى / يسعى", category: "general", difficulty: "hard" },
  { word: "erosion", definition: "The gradual destruction or wearing away", example: "Soil erosion is a major environmental concern.", arabicMeaning: "تآكل", category: "general", difficulty: "medium" },
  { word: "ethical", definition: "Relating to moral principles of right and wrong", example: "The experiment raised ethical concerns.", arabicMeaning: "أخلاقي", category: "general", difficulty: "medium" },
  { word: "explicit", definition: "Stated clearly and in detail, leaving no room for doubt", example: "The instructions were explicit and easy to follow.", arabicMeaning: "صريح", category: "general", difficulty: "medium" },
  { word: "extract", definition: "To remove or take out; a short passage from a text", example: "Researchers extracted DNA from the samples.", arabicMeaning: "يستخرج", category: "general", difficulty: "medium" },
  { word: "fluctuation", definition: "An irregular rising and falling in number or amount", example: "Currency fluctuations affect international trade.", arabicMeaning: "تذبذب", category: "general", difficulty: "hard" },
  { word: "gender", definition: "The state of being male or female", example: "Gender equality is an important social issue.", arabicMeaning: "جنس / نوع اجتماعي", category: "general", difficulty: "easy" },
  { word: "hierarchy", definition: "A system in which members are ranked according to status", example: "Corporate hierarchy determines decision-making authority.", arabicMeaning: "تسلسل هرمي", category: "general", difficulty: "hard" },
  { word: "ideology", definition: "A system of ideas and ideals forming the basis of a theory", example: "Political ideology shapes policy decisions.", arabicMeaning: "أيديولوجيا", category: "general", difficulty: "hard" },
  { word: "implicit", definition: "Implied though not plainly expressed", example: "There was an implicit understanding between them.", arabicMeaning: "ضمني", category: "general", difficulty: "hard" },
  { word: "inclination", definition: "A tendency or natural desire to act or feel a particular way", example: "She has an inclination toward scientific research.", arabicMeaning: "ميل", category: "general", difficulty: "medium" },
  { word: "integrity", definition: "The quality of being honest and having strong moral principles", example: "Academic integrity is essential in research.", arabicMeaning: "نزاهة", category: "general", difficulty: "medium" },
  { word: "invoke", definition: "To cite or appeal to as an authority", example: "The lawyer invoked the constitutional amendment.", arabicMeaning: "يستدعي / يحتج بـ", category: "general", difficulty: "hard" },
  { word: "legislation", definition: "Laws enacted by a legislative body", example: "New legislation aims to reduce carbon emissions.", arabicMeaning: "تشريع", category: "general", difficulty: "medium" },
  { word: "magnitude", definition: "The great size or extent of something", example: "The magnitude of the problem is often underestimated.", arabicMeaning: "حجم / ضخامة", category: "general", difficulty: "hard" },
  { word: "mechanism", definition: "A system of parts working together; a natural process", example: "The mechanism of gene expression is complex.", arabicMeaning: "آلية", category: "general", difficulty: "medium" },
  { word: "offset", definition: "To counterbalance or compensate for something", example: "The gains offset the earlier losses.", arabicMeaning: "يعوّض", category: "general", difficulty: "medium" },
  { word: "oversee", definition: "To supervise or watch over a process or task", example: "The manager oversees the daily operations.", arabicMeaning: "يشرف على", category: "general", difficulty: "medium" },
  { word: "precedent", definition: "An earlier event or action that serves as an example", example: "The court ruling set a legal precedent.", arabicMeaning: "سابقة", category: "general", difficulty: "hard" },
  { word: "predominant", definition: "Present as the strongest or main element", example: "Agriculture is the predominant industry in the region.", arabicMeaning: "سائد / غالب", category: "general", difficulty: "medium" },
  { word: "preliminary", definition: "Preceding or done in preparation for something more important", example: "Preliminary research suggests a positive outcome.", arabicMeaning: "أولي / تمهيدي", category: "general", difficulty: "medium" },
  { word: "prevalence", definition: "The fact of being widespread or common", example: "The prevalence of diabetes is increasing worldwide.", arabicMeaning: "انتشار", category: "general", difficulty: "hard" },
  { word: "prohibit", definition: "To formally forbid by law or authority", example: "The law prohibits discrimination in the workplace.", arabicMeaning: "يحظر", category: "general", difficulty: "medium" },
  { word: "proportional", definition: "Corresponding in size or amount to something else", example: "The reward should be proportional to the effort.", arabicMeaning: "متناسب", category: "general", difficulty: "medium" },
  { word: "prospect", definition: "The possibility or likelihood of a future event", example: "The prospect of promotion motivated the employees.", arabicMeaning: "احتمال / فرصة", category: "general", difficulty: "medium" },
];
