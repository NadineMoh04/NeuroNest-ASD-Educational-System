import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const DICTIONARY = {
  
  'Color Matching Game': 'لعبة مطابقة الألوان',
  'Shape Sorting': 'تصنيف الأشكال',
  'Number Recognition': 'تمييز الأرقام',
  'Simple Math': 'الرياضيات البسيطة',
  'Animal Matching': 'مطابقة الحيوانات',
  'Letter Tracing': 'تتبع الحروف',
  'Memory Card Flip': 'قلب بطاقات الذاكرة',
  'Sound Recognition': 'تمييز الأصوات',
  'Pattern Completion': 'إكمال الأنماط',
  'Counting Objects': 'عد الأشياء',
  'Categorization Game': 'لعبة التصنيف',
  'Play': 'العب',
  'Completed': 'مكتمل',
  '✓ Completed!': '✓ مكتمل!',

  
  'Difficulty': 'الصعوبة',
  'Easy': 'سهل',
  'Medium': 'متوسط',
  'Hard': 'صعب',
  'Stars': 'نجوم',
  'Great Job!': 'عمل رائع!',
  'Find the': 'ابحث عن',
  'Box': 'مربع',
  'Find': 'ابحث عن',
  'Close Game': 'إغلاق اللعبة',
  'Round': 'الجولة',
  'Well done!': 'عمل رائع!',
  'Try again': 'حاول ثانية',
  'Level': 'المستوى',

  
  'Red': 'الأحمر',
  'Blue': 'الأزرق',
  'Green': 'الأخضر',
  'Yellow': 'الأصفر',
  'Purple': 'البنفسجي',
  'Orange': 'البرتقالي',

  
  'Apple': 'تفاحة',
  'Car': 'سيارة',
  'Leaf': 'ورقة شجر',
  'Star': 'نجمة',
  'Grapes': 'عنب',

  
  'Square': 'مربع',
  'Circle': 'دائرة',
  'Triangle': 'مثلث',
  'Heart': 'قلب',
  'Rectangle': 'مستطيل',

  
  'Dog': 'كلب',
  'Cat': 'قطة',
  'Cow': 'بقرة',
  'Duck': 'بطة',
  'Pig': 'خنزير',
  'Horse': 'حصان',
  'Sheep': 'خروف',
  'Chicken': 'دجاجة',
  'Frog': 'ضفدع',
  'Lion': 'أسد',
  'Elephant': 'فيل',
  'Monkey': 'قرد',

  
  'Your Children': 'أطفالك',
  '👁️ View Profile': '👁️ عرض الملف الشخصي',
  '📊 View Progress Report': '📊 عرض تقرير التقدم',
  '🎮 Enter Child Mode': '🎮 دخول وضع الطفل',
  'Welcome': 'مرحباً',
  'Welcome,': 'مرحباً،',
  ' Logout': 'تسجيل الخروج',
  '🏆 Points': '🏆 نقاط',
  '🔥 Streak': '🔥 تفاعل متتالي',
  '✅ Activities': '✅ الأنشطة',
  '🎂 Age': '🎂 العمر',
  'Gender': 'الجنس',
  'Age': 'العمر',
  'Streak': 'أيام متتالية',
  'Points': 'النقاط',
  'Activities': 'الأنشطة',
  'days': 'أيام',
  'years': 'سنوات',
  'Mood': 'المزاج',
  '💭 Mood': '💭 المزاج',
  'No children found. Please contact support if this is unexpected.': 'لم يتم العثور على أطفال. يرجى التواصل مع الدعم إذا كان هذا غير متوقع.',

  
  'Step 2 of 3': 'الخطوة ٢ من ٣',
  'Child Information': 'معلومات الطفل',
  'This information helps us personalize learning and support for your child.': 'هذه المعلومات تساعدنا في تخصيص التعلم والدعم لطفلك.',
  '👨‍👩‍👧 Parent Information': '👨‍👩‍👧 معلومات ولي الأمر',
  '🧠 Assessment & Behavioral Scores': '🧠 التقييم والدرجات السلوكية',
  '👶 Basic Child Information': '👶 معلومات الطفل الأساسية',
  '🧬 Medical & Genetic History': '🧬 التاريخ الطبي والجيني',
  '👨‍👩‍👧 Family Background': '👨‍👩‍👧 الخلفية العائلية',
  '📝 Respondent Information': '📝 بيانات التقييم الوصفية',
  'Parent Full Name': 'الاسم الكامل لولي الأمر',
  'Enter parent\'s full name': 'أدخل الاسم الكامل لولي الأمر',
  'Parent Email': 'البريد الإلكتروني لولي الأمر',
  'Enter parent\'s email': 'أدخل البريد الإلكتروني لولي الأمر',
  'Parent Password': 'كلمة مرور ولي الأمر',
  'Confirm Password': 'تأكيد كلمة المرور',
  'Child\'s Name': 'اسم الطفل',
  'Enter child\'s name': 'أدخل اسم الطفل',
  'Q-CHAT-10 Score': 'درجة تقييم Q-CHAT-10',
  'Enter score (0-10)': 'أدخل الدرجة (0-10)',
  'Based on your child\'s current behaviors. Score range: 0 (low risk) to 10 (high risk)': 'بناءً على سلوكيات طفلك الحالية. نطاق الدرجات: 0 (خطر منخفض) إلى 10 (خطر مرتفع)',
  'Age (Years)': 'العمر (بالسنوات)',
  'Sex': 'الجنس',
  'Select...': 'اختر...',
  'Male': 'ذكر',
  'Female': 'أنثى',
  'Other': 'أخرى',
  'Ethnicity': 'العرق / الجنسية',
  'Asian': 'آسيوي',
  'Black': 'أسمر / أفريقي',
  'Hispanic': 'لاتيني',
  'White': 'أبيض',
  'Mixed': 'مختلط',
  'Jaundice': 'الصفراء (اليرقان)',
  'Jaundice is a condition where a baby or child’s skin and the white part of the eyes look yellow.': 'الصفراء هي حالة يبدو فيها جلد الطفل وبياض عينيه باللون الأصفر.',
  'Family Member with ASD': 'فرد من العائلة مصاب بطيف التوحد',
  'Who Completed the Test': 'من أكمل الاختبار',
  'Guardian': 'وصي',
  'Teacher': 'معلم',
  'Specialist': 'أخصائي',
  'Parent': 'ولي أمر',
  'Get ASD Prediction': 'الحصول على تشخيص الذكاء الاصطناعي',
  'Analyzing...': 'جاري التحليل...',
  'Save & Continue': 'حفظ ومتابعة',
  '🤖 ML Prediction Results': '🤖 نتائج تحليل الذكاء الاصطناعي',
  'ASD Likely': 'احتمال وجود توحد',
  'ASD Unlikely': 'مستبعد وجود توحد',
  'Confidence:': 'دقة التحليل:',
  'ASD Probability:': 'احتمالية الإصابة بطيف التوحد:',
  'No ASD:': 'خالٍ من التوحد:',
  'ASD:': 'مصاب بالتوحد:',
  'Risk Level:': 'مستوى الخطر:',
  'Yes': 'نعم',
  'No': 'لا',
  'Low': 'منخفض',
  'Medium': 'متوسط',
  'High': 'مرتفع',
  'Moderate': 'متوسط',

  
  'Hello,': 'مرحباً،',
  'Hello': 'مرحباً',
  'Exit Child Mode': 'الخروج من وضع الطفل',
  'Today\'s Activities': 'أنشطة اليوم',
  'Complete up to 3 activities for fun rewards!': 'أكمل ما يصل إلى 3 أنشطة للحصول على مكافآت ممتعة!',
  'How are you feeling?': 'كيف تشعر الآن؟',
  'Check In': 'تسجيل الشعور',
  'Tap how you feel:': 'اضغط على ما تشعر به:',
  'Save Feeling': 'حفظ الشعور',
  'Cancel': 'إلغاء',
  'Reward Store': 'متجر المكافآت',
  'Earn points to unlock fun rewards!': 'اكسب نقاطاً لفتح مكافآت ممتعة!',
  'pts': 'نقاط',
  'Unlocked!': 'مفتوح!',
  'Loading child mode...': 'جاري تحميل وضع الطفل...',
  '😊 Happy': '😊 سعيد',
  '😐 Neutral': '😐 طبيعي',
  '😢 Sad': '😢 حزين',
  '😠 Angry': '😠 غاضب',
  'Star Sticker': 'ملصق نجمة',
  'Unicorn Badge': 'شارة وحيد القرن',
  'Trophy': 'كأس',

  
  'Play Together Mode': 'وضع اللعب معاً',
  'Play and learn together with': 'العب وتعلم مع',
  'Games Together': 'الألعاب المشتركة',
  'Time Spent': 'الوقت المستغرق',
  'Team Stars': 'نجوم الفريق',
  'Family Points': 'نقاط العائلة',
  'Games completed': 'ألعاب مكتملة',
  'Time spent together': 'الوقت المقضي معاً',
  'Start playing together!': 'ابدأ اللعب معاً!',
  'Played today! 🎉': 'لعبتم اليوم! 🎉',
  'Played yesterday': 'لعبتم بالأمس',
  'Last played': 'آخر لعب',
  'days ago': 'أيام مضت',
  'Beginner': 'مبتدئ',
  'Getting Started': 'البداية',
  'Active Players': 'لاعبون نشطون',
  'Team Players': 'لاعبو الفريق',
  'Super Team': 'فريق خارق',
  'Champions': 'أبطال',
  'Play Together': 'اللعب معاً',
  '✨ Start your first adventure together!': '✨ ابدأ مغامرتكم الأولى معاً!',
  '🌟 Great start! Keep playing together!': '🌟 بداية رائعة! استمروا في اللعب معاً!',
  '🎉 You\'re becoming a great team!': '🎉 أنتم تصبحون فريقاً رائعاً!',
  '🏆 Amazing teamwork! Keep it up!': '🏆 عمل جماعي مذهل! استمروا على هذا النحو!',
  'Playing with': 'اللعب مع',
  'Games Played': 'ألعاب ملعوبة',
  'Exit': 'خروج',
  'Your Play Together Progress': 'تقدم اللعب المشترك',
  'Time Together': 'الوقت معاً',
  'Badges Earned': 'الشارات المكتسبة',
  'Never played': 'لم يتم اللعب مسبقاً',
  'Today': 'اليوم',
  'Yesterday': 'الأمس',
  'Teamwork Badges': 'شارات العمل الجماعي',
  'Cooperative Games': 'الألعاب التعاونية',
  'Play together and earn family rewards!': 'العبوا معاً واكسبوا مكافآت عائلية!',
  'Played': 'تم لعبها',
  '✔ Played': '✔ تم لعبها',
  'Stars': 'نجوم',
  'FP': 'ن.ع',
  'Parent:': 'ولي الأمر:',
  'Child:': 'الطفل:',
  'Progress': 'التقدم',
  'Rewards:': 'المكافآت:',
  'Play Again Together': 'العب مجدداً معاً',
  'Last played:': 'آخر لعب:',
  'Tips for Playing Together': 'نصائح للعب معاً',
  'Communicate': 'التواصل',
  'Talk through the game together. Ask questions and encourage!': 'تحدثا معاً أثناء اللعب. اطرح أسئلة وشجع طفلك!',
  'Take Turns': 'تبادل الأدوار',
  'Let your child lead sometimes. Guide them gently when needed.': 'دع طفلك يقود اللعب أحياناً. وجهه بلطف عند الحاجة.',
  'Celebrate Together': 'الاحتفال معاً',
  'Celebrate wins as a team! Every achievement counts.': 'احتفلا بالفوز كفريق واحد! كل إنجاز مهم.',
  'Keep it Fun': 'اجعل اللعب ممتعاً',
  'Keep sessions short and positive. Quality time matters most!': 'اجعل الجلسات قصيرة وإيجابية. الوقت النوعي هو الأهم!',
  'Loading Play Together Mode...': 'جاري تحميل وضع اللعب معاً...',
  'Teamwork Star': 'نجم العمل الجماعي',
  'Parent': 'ولي الأمر',
  'm': 'د',
  'h': 'س',

  
  'Animal Matching': 'مطابقة الحيوانات',
  'Match animal pairs together': 'طابق أزواج الحيوانات معاً',
  'Help find matching pairs': 'ساعد في العثور على الأزواج المتطابقة',
  'Flip cards and remember': 'اقلب البطاقات وتذكر مكانها',
  'Take turns flipping cards!': 'تبادلا الأدوار في قلب البطاقات!',

  'Memory Game': 'لعبة الذاكرة',
  'Find matching cards as a team': 'ابحثا عن البطاقات المتطابقة كفريق',
  'Help remember card positions': 'ساعد في تذكر مواقع البطاقات',
  'Match the pairs': 'طابق الأزواج',
  'Work together to remember!': 'اعملا معاً للتذكر!',

  'Counting Objects': 'عد الأشياء',
  'Count and learn numbers together': 'عدا الأشياء وتعلما الأرقام معاً',
  'Ask "How many do you see?"': 'اسأل: "كم واحداً ترى؟"',
  'Count the objects': 'عد الأشياء',
  'Count out loud together!': 'عدا بصوت عالٍ معاً!',

  'Pattern Game': 'لعبة الأنماط',
  'Complete patterns as a team': 'أكملا الأنماط كفريق واحد',
  'Ask "What comes next?"': 'اسأل: "ماذا يأتي بعد ذلك؟"',
  'Find the missing piece': 'جد القطعة المفقودة',
  'Discuss the pattern together!': 'ناقشا النمط معاً!',

  'Letter Tracing': 'تتبع الحروف',
  'Trace letters together': 'تتبعا الحروف معاً',
  'Guide their hand and encourage': 'وجه يده وشجعه',
  'Trace the letter': 'تتبع الحرف',
  'Help them follow the shape!': 'ساعده في اتباع شكل الحرف!',

  'Sound Recognition': 'تمييز الأصوات',
  'Identify sounds together': 'ميّزا الأصوات معاً',
  'Listen together and discuss': 'استمعا معاً وتناقشا',
  'Choose the correct sound': 'اختر الصوت الصحيح',
  'Make the sounds together!': 'أصدرا الأصوات معاً!',

  'Find the Toy': 'البحث عن اللعبة',
  'Parent guides child to find the target toy': 'يوجه ولي الأمر الطفل للعثور على اللعبة المستهدفة',
  'See the target and give hints': 'شاهد الهدف وقدم تلميحات',
  'Search and find the toy': 'ابحث عن اللعبة وجدها',
  'Give clear directions like "left" or "right"!': 'قدم اتجاهات واضحة مثل "يمين" أو "يسار"!',

  'Guess the Emotion': 'تخمين المشاعر',
  'Parent makes face, child guesses emotion': 'يعبر ولي الأمر بوجهه، ويخمن الطفل الشعور',
  'Make facial expressions': 'اصنع تعبيرات وجهية',
  'Guess the emotion': 'خمن الشعور',
  'Use exaggerated expressions to help!': 'استخدم تعبيرات مبالغاً فيها للمساعدة!',

  'Build Together': 'البناء معاً',
  'Parent sees full picture, guides child to build': 'يرى ولي الأمر الصورة الكاملة، ويوجه الطفل للبناء',
  'Describe where pieces go': 'صف أين تذهب القطع',
  'Place the puzzle pieces': 'ضع قطع الأحجية في مكانها',
  'Be specific: "Put the red piece on top"!': 'كن محدداً: "ضع القطعة الحمراء في الأعلى"!',

  'My Turn – Your Turn': 'دوري - دورك',
  'Take turns to complete actions together': 'تبادلا الأدوار لإكمال المهام معاً',
  'Wait for your turn patiently': 'انتظر دورك بصبر',
  'Complete your turn': 'أكمل دورك',
  'Say "My turn" and "Your turn" clearly!': 'قولا "دوري" و "دورك" بوضوح!',

  'Sound & Guess': 'الصوت والتخمين',
  'Parent imitates sound, child guesses what it is': 'يقلد ولي الأمر صوتاً، ويخمن الطفل مصدره',
  'Imitate the sound you hear': 'قلد الصوت الذي تسمعه',
  'Guess what made the sound': 'خمن ما الذي أصدر هذا الصوت',
  'Have fun making silly sounds!': 'استمتعا بإصدار أصوات مضحكة!',

  'Story Together': 'تأليف القصة معاً',
  'Parent creates events, child chooses emotions': 'يبتكر ولي الأمر الأحداث، ويختار الطفل مشاعر الشخصيات',
  'Create story events': 'ابتكر أحداث القصة',
  'Choose emotions for characters': 'اختر مشاعر الشخصيات',
  'Make it interactive and fun!': 'اجعلاها تفاعلية وممتعة!',

  'Categorization Game': 'لعبة التصنيف',
  'Sort objects into categories together': 'صنفا الأشياء إلى فئات معاً',
  'Help identify categories': 'ساعد في تحديد الفئات',
  'Drag objects to correct boxes': 'اسحب الأشياء إلى الصناديق الصحيحة',
  'Discuss why each object belongs in its category!': 'تناقشا حول سبب انتماء كل مجسم لفئته!'
};

export const LanguageProvider = ({ children }) => {
  const [isArabic, setIsArabic] = useState(() => {
    return localStorage.getItem('lang') === 'ar';
  });

  useEffect(() => {
    localStorage.setItem('lang', isArabic ? 'ar' : 'en');
    
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [isArabic]);

  const toggleLanguage = () => setIsArabic(prev => !prev);

  
  const t = (text) => {
    if (!isArabic) return text;
    if (!text) return '';
    const cleanText = text.trim();
    return DICTIONARY[cleanText] || cleanText;
  };

  return (
    <LanguageContext.Provider value={{ isArabic, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
