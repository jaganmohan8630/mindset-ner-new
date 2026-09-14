// Shared, UI-only text. Feature dictionaries can continue to own feature-specific copy.
// `uiText` remains the existing public API; `getUIText` is the normalized API for new code.

const english = {
  back: "Back", next: "Next", previous: "Previous", save: "Save", saveChanges: "Save Changes",
  cancel: "Cancel", close: "Close", edit: "Edit", delete: "Delete", loading: "Loading…",
  error: "Error", success: "Success", retry: "Try again", submit: "Submit", search: "Search",
  patient: "Patient", caregiver: "Caregiver", elder: "Elder", age: "Age", gender: "Gender",
  language: "Language", connected: "Connected", connection: "Connection", messages: "Messages",
  reminder: "Reminder", reminders: "Reminders", active: "Active", inactive: "Inactive",
  yes: "Yes", no: "No", score: "Score", accuracy: "Accuracy", level: "Level",
  complete: "Complete", completed: "Completed", start: "Start", continue: "Continue", replay: "Replay",
  noData: "No data available.", noResults: "No results found.", noReminders: "No reminders yet.",
  noMessages: "No messages yet.", noConnections: "No connections yet.", noActivity: "No activity yet.",
  tryAgain: "Please try again.", confirm: "Confirm", confirmDelete: "Are you sure you want to delete this?",
  confirmRemove: "Are you sure you want to remove this?", somethingWentWrong: "Something went wrong.",
  unableToLoad: "Could not load this information.", unableToSave: "Could not save your changes.",
  savedSuccessfully: "Saved successfully.", updatedSuccessfully: "Updated successfully.",
  deletedSuccessfully: "Deleted successfully.", pleaseWait: "Please wait…", searching: "Searching…",
  notFound: "Not found.", optional: "Optional", today: "Today", date: "Date", time: "Time",
  status: "Status", details: "Details", view: "View", manage: "Manage", home: "Home",
  logout: "Log out", accept: "Accept", reject: "Reject", decline: "Decline", remove: "Remove",
  add: "Add", create: "Create", update: "Update", select: "Select", all: "All", none: "None",
  elderMessages: "Elder Messages", connectedElders: "Connected Elders",
  noElderConnections: "No elder connections yet.", playVoiceMessage: "Play voice message",
  startConversation: "Start a friendly conversation.", writeMessage: "Write a message", send: "Send",
  recordVoiceMessage: "Record voice message", stopAndSendVoiceMessage: "Stop and send voice message",
  sendingVoiceMessage: "Sending voice message…", selectElder: "Select an elder to start messaging.",
  profile: "My Profile", patientAccount: "Patient Account", viewProfile: "View and manage your personal information.",
  editProfile: "Edit Profile", name: "Name", caregiverName: "Caregiver Name", caregiverPhone: "Caregiver Phone",
  notProvided: "Not provided", connectionRequests: "New connection request",
  supportYou: "Someone wants to support you", verifiedCaregiver: "Verified caregiver",
  caregiverRequest: "would like to connect with you as your caregiver.", notNow: "Not now",
  acceptRequest: "Accept request", connectionPrivacy: "You choose who can view your progress. You can manage connections later.",
};

const hindi = {
  back: "वापस", next: "आगे", previous: "पिछला", save: "सहेजें", saveChanges: "बदलाव सहेजें", cancel: "रद्द करें", close: "बंद करें", edit: "बदलें", delete: "हटाएँ", loading: "लोड हो रहा है…", error: "त्रुटि", success: "सफल", retry: "फिर कोशिश करें", submit: "जमा करें", search: "खोजें", patient: "रोगी", caregiver: "देखभालकर्ता", elder: "वरिष्ठ", age: "उम्र", gender: "लिंग", language: "भाषा", connected: "जुड़ा हुआ", connection: "संपर्क", messages: "संदेश", reminder: "रिमाइंडर", reminders: "रिमाइंडर", active: "सक्रिय", inactive: "निष्क्रिय", yes: "हाँ", no: "नहीं", score: "स्कोर", accuracy: "सटीकता", level: "स्तर", complete: "पूरा करें", completed: "पूरा हुआ", start: "शुरू करें", continue: "जारी रखें", replay: "फिर चलाएँ", noData: "कोई जानकारी उपलब्ध नहीं है।", noResults: "कोई परिणाम नहीं मिला।", noReminders: "अभी कोई रिमाइंडर नहीं है।", noMessages: "अभी कोई संदेश नहीं है।", noConnections: "अभी कोई संपर्क नहीं है।", noActivity: "अभी कोई गतिविधि नहीं है।", tryAgain: "कृपया फिर कोशिश करें।", confirm: "पुष्टि करें", confirmDelete: "क्या आप इसे हटाना चाहते हैं?", confirmRemove: "क्या आप इसे हटाना चाहते हैं?", somethingWentWrong: "कुछ गलत हो गया।", unableToLoad: "यह जानकारी लोड नहीं हो सकी।", unableToSave: "आपके बदलाव सहेजे नहीं जा सके।", savedSuccessfully: "सफलतापूर्वक सहेजा गया।", updatedSuccessfully: "सफलतापूर्वक बदला गया।", deletedSuccessfully: "सफलतापूर्वक हटाया गया।", pleaseWait: "कृपया प्रतीक्षा करें…", searching: "खोजा जा रहा है…", notFound: "नहीं मिला।", optional: "वैकल्पिक", today: "आज", date: "तारीख", time: "समय", status: "स्थिति", details: "विवरण", view: "देखें", manage: "प्रबंधित करें", home: "होम", logout: "लॉग आउट", accept: "स्वीकार करें", reject: "अस्वीकार करें", decline: "मना करें", remove: "हटाएँ", add: "जोड़ें", create: "बनाएँ", update: "बदलें", select: "चुनें", all: "सभी", none: "कोई नहीं",
  elderMessages: "वरिष्ठों के संदेश", connectedElders: "जुड़े हुए वरिष्ठ", noElderConnections: "अभी कोई वरिष्ठ संपर्क नहीं है।", playVoiceMessage: "आवाज़ वाला संदेश चलाएँ", startConversation: "प्यार से बातचीत शुरू करें।", writeMessage: "संदेश लिखें", send: "भेजें", recordVoiceMessage: "आवाज़ वाला संदेश रिकॉर्ड करें", stopAndSendVoiceMessage: "रोकें और आवाज़ वाला संदेश भेजें", sendingVoiceMessage: "आवाज़ वाला संदेश भेजा जा रहा है…", selectElder: "संदेश शुरू करने के लिए किसी वरिष्ठ को चुनें।", profile: "मेरी प्रोफ़ाइल", patientAccount: "रोगी खाता", viewProfile: "अपनी व्यक्तिगत जानकारी देखें और संभालें।", editProfile: "प्रोफ़ाइल बदलें", name: "नाम", caregiverName: "देखभालकर्ता का नाम", caregiverPhone: "देखभालकर्ता का फ़ोन", notProvided: "उपलब्ध नहीं", connectionRequests: "नया संपर्क अनुरोध", supportYou: "कोई आपकी सहायता करना चाहता है", verifiedCaregiver: "सत्यापित देखभालकर्ता", caregiverRequest: "आपके देखभालकर्ता के रूप में जुड़ना चाहता है।", notNow: "अभी नहीं", acceptRequest: "अनुरोध स्वीकार करें", connectionPrivacy: "आप तय करते हैं कि आपकी प्रगति कौन देख सकता है। आप बाद में संपर्क बदल सकते हैं।",
};

const telugu = {
  back: "వెనుకకు", next: "తదుపరి", previous: "మునుపటి", save: "సేవ్ చేయండి", saveChanges: "మార్పులను సేవ్ చేయండి", cancel: "రద్దు చేయండి", close: "మూసివేయండి", edit: "సవరించండి", delete: "తొలగించండి", loading: "లోడ్ అవుతోంది…", error: "లోపం", success: "విజయవంతం", retry: "మళ్లీ ప్రయత్నించండి", submit: "సమర్పించండి", search: "వెతకండి", patient: "రోగి", caregiver: "సంరక్షకుడు", elder: "పెద్దవారు", age: "వయస్సు", gender: "లింగం", language: "భాష", connected: "కలిసారు", connection: "కనెక్షన్", messages: "సందేశాలు", reminder: "గుర్తుచూపు", reminders: "గుర్తుచూపులు", active: "సక్రియం", inactive: "నిష్క్రియం", yes: "అవును", no: "కాదు", score: "స్కోర్", accuracy: "ఖచ్చితత్వం", level: "స్థాయి", complete: "పూర్తి చేయండి", completed: "పూర్తయింది", start: "ప్రారంభించండి", continue: "కొనసాగించండి", replay: "మళ్లీ వినండి", noData: "సమాచారం అందుబాటులో లేదు.", noResults: "ఫలితాలు లేవు.", noReminders: "ఇంకా గుర్తుచూపులు లేవు.", noMessages: "ఇంకా సందేశాలు లేవు.", noConnections: "ఇంకా కనెక్షన్లు లేవు.", noActivity: "ఇంకా కార్యకలాపాలు లేవు.", tryAgain: "దయచేసి మళ్లీ ప్రయత్నించండి.", confirm: "నిర్ధారించండి", confirmDelete: "దీనిని తొలగించాలా?", confirmRemove: "దీనిని తీసివేయాలా?", somethingWentWrong: "ఏదో లోపం జరిగింది.", unableToLoad: "ఈ సమాచారం లోడ్ కాలేదు.", unableToSave: "మీ మార్పులు సేవ్ కాలేదు.", savedSuccessfully: "విజయవంతంగా సేవ్ అయింది.", updatedSuccessfully: "విజయవంతంగా నవీకరించబడింది.", deletedSuccessfully: "విజయవంతంగా తొలగించబడింది.", pleaseWait: "దయచేసి వేచి ఉండండి…", searching: "వెతుకుతోంది…", notFound: "కనిపించలేదు.", optional: "ఐచ్ఛికం", today: "ఈ రోజు", date: "తేదీ", time: "సమయం", status: "స్థితి", details: "వివరాలు", view: "చూడండి", manage: "నిర్వహించండి", home: "హోమ్", logout: "లాగ్ అవుట్", accept: "అంగీకరించండి", reject: "తిరస్కరించండి", decline: "వద్దు", remove: "తీసివేయండి", add: "జోడించండి", create: "సృష్టించండి", update: "నవీకరించండి", select: "ఎంచుకోండి", all: "అన్నీ", none: "ఏదీ లేదు",
  elderMessages: "పెద్దల సందేశాలు", connectedElders: "కలిసిన పెద్దలు", noElderConnections: "ఇంకా పెద్దల కనెక్షన్లు లేవు.", playVoiceMessage: "వాయిస్ సందేశం వినండి", startConversation: "ఆప్యాయంగా మాట్లాడటం ప్రారంభించండి.", writeMessage: "సందేశం రాయండి", send: "పంపండి", recordVoiceMessage: "వాయిస్ సందేశం రికార్డ్ చేయండి", stopAndSendVoiceMessage: "ఆపి వాయిస్ సందేశం పంపండి", sendingVoiceMessage: "వాయిస్ సందేశం పంపుతోంది…", selectElder: "సందేశం ప్రారంభించడానికి ఒక పెద్దవారిని ఎంచుకోండి.", profile: "నా ప్రొఫైల్", patientAccount: "రోగి ఖాతా", viewProfile: "మీ వ్యక్తిగత సమాచారాన్ని చూడండి, నిర్వహించండి.", editProfile: "ప్రొఫైల్ సవరించండి", name: "పేరు", caregiverName: "సంరక్షకుని పేరు", caregiverPhone: "సంరక్షకుని ఫోన్", notProvided: "అందించలేదు", connectionRequests: "కొత్త కనెక్షన్ అభ్యర్థన", supportYou: "ఎవరో మీకు సహాయం చేయాలనుకుంటున్నారు", verifiedCaregiver: "ధృవీకరించిన సంరక్షకుడు", caregiverRequest: "మీ సంరక్షకునిగా కనెక్ట్ కావాలనుకుంటున్నారు.", notNow: "ఇప్పుడు కాదు", acceptRequest: "అభ్యర్థన అంగీకరించండి", connectionPrivacy: "మీ పురోగతిని ఎవరు చూడాలో మీరు నిర్ణయిస్తారు. కనెక్షన్లను తర్వాత నిర్వహించవచ్చు.",
};

const assamese = {
  back: "উভতি যাওক", next: "আগলৈ", previous: "পূৰ্বৰ", save: "সংৰক্ষণ কৰক", saveChanges: "পৰিৱৰ্তন সংৰক্ষণ কৰক", cancel: "বাতিল কৰক", close: "বন্ধ কৰক", edit: "সম্পাদনা কৰক", delete: "মচি পেলাওক", loading: "লোড হৈ আছে…", error: "ভুল", success: "সফল", retry: "আকৌ চেষ্টা কৰক", submit: "জমা দিয়ক", search: "বিচাৰক", patient: "ৰোগী", caregiver: "যত্নদাতা", elder: "জ্যেষ্ঠ", age: "বয়স", gender: "লিংগ", language: "ভাষা", connected: "সংযুক্ত", connection: "সংযোগ", messages: "বাৰ্তা", reminder: "সোঁৱৰণী", reminders: "সোঁৱৰণীসমূহ", active: "সক্ৰিয়", inactive: "নিষ্ক্ৰিয়", yes: "হয়", no: "নহয়", score: "নম্বৰ", accuracy: "শুদ্ধতা", level: "স্তৰ", complete: "সম্পূৰ্ণ কৰক", completed: "সম্পূৰ্ণ হৈছে", start: "আৰম্ভ কৰক", continue: "আগবাঢ়ক", replay: "আকৌ চলাওক", noData: "কোনো তথ্য উপলব্ধ নাই।", noResults: "কোনো ফল পোৱা নগ'ল।", noReminders: "এতিয়াও কোনো সোঁৱৰণী নাই।", noMessages: "এতিয়াও কোনো বাৰ্তা নাই।", noConnections: "এতিয়াও কোনো সংযোগ নাই।", noActivity: "এতিয়াও কোনো কাৰ্যকলাপ নাই।", tryAgain: "অনুগ্ৰহ কৰি আকৌ চেষ্টা কৰক।", confirm: "নিশ্চিত কৰক", confirmDelete: "আপুনি এইটো মচি পেলাব নে?", confirmRemove: "আপুনি এইটো আঁতৰাব নে?", somethingWentWrong: "কিবা ভুল হ'ল।", unableToLoad: "এই তথ্য লোড কৰিব নোৱাৰিলে।", unableToSave: "আপোনাৰ পৰিৱৰ্তন সংৰক্ষণ কৰিব নোৱাৰিলে।", savedSuccessfully: "সফলতাৰে সংৰক্ষণ কৰা হ'ল।", updatedSuccessfully: "সফলতাৰে সলনি কৰা হ'ল।", deletedSuccessfully: "সফলতাৰে মচি পেলোৱা হ'ল।", pleaseWait: "অনুগ্ৰহ কৰি অপেক্ষা কৰক…", searching: "বিচাৰি আছে…", notFound: "পোৱা নগ'ল।", optional: "ঐচ্ছিক", today: "আজি", date: "তাৰিখ", time: "সময়", status: "অৱস্থা", details: "বিৱৰণ", view: "চাওক", manage: "পৰিচালনা কৰক", home: "হোম", logout: "লগ আউট", accept: "গ্ৰহণ কৰক", reject: "প্ৰত্যাখ্যান কৰক", decline: "নাকচ কৰক", remove: "আঁতৰাওক", add: "যোগ কৰক", create: "সৃষ্টি কৰক", update: "সংশোধন কৰক", select: "বাছক", all: "সকলো", none: "এটাও নহয়",
  elderMessages: "জ্যেষ্ঠৰ বাৰ্তা", connectedElders: "সংযুক্ত জ্যেষ্ঠসকল", noElderConnections: "এতিয়াও কোনো জ্যেষ্ঠ সংযোগ নাই।", playVoiceMessage: "কণ্ঠ বাৰ্তা শুনক", startConversation: "এখন মৰমীয়াল কথা-বতৰা আৰম্ভ কৰক।", writeMessage: "বাৰ্তা লিখক", send: "পঠাওক", recordVoiceMessage: "কণ্ঠ বাৰ্তা ৰেকৰ্ড কৰক", stopAndSendVoiceMessage: "ৰখাওক আৰু কণ্ঠ বাৰ্তা পঠাওক", sendingVoiceMessage: "কণ্ঠ বাৰ্তা পঠিওৱা হৈছে…", selectElder: "বাৰ্তা আৰম্ভ কৰিবলৈ এজন জ্যেষ্ঠ বাছক।", profile: "মোৰ প্ৰ'ফাইল", patientAccount: "ৰোগীৰ একাউণ্ট", viewProfile: "আপোনাৰ ব্যক্তিগত তথ্য চাওক আৰু পৰিচালনা কৰক।", editProfile: "প্ৰ'ফাইল সম্পাদনা কৰক", name: "নাম", caregiverName: "যত্নদাতাৰ নাম", caregiverPhone: "যত্নদাতাৰ ফোন", notProvided: "দিয়া হোৱা নাই", connectionRequests: "নতুন সংযোগ অনুৰোধ", supportYou: "কোনোবাই আপোনাক সহায় কৰিব বিচাৰে", verifiedCaregiver: "যাচাইকৃত যত্নদাতা", caregiverRequest: "আপোনাৰ যত্নদাতা হিচাপে সংযোগ কৰিব বিচাৰে।", notNow: "এতিয়া নহয়", acceptRequest: "অনুৰোধ গ্ৰহণ কৰক", connectionPrivacy: "আপোনাৰ অগ্ৰগতি কোনে চাব পাৰে সেয়া আপুনি ঠিক কৰে। আপুনি পিছত সংযোগ পৰিচালনা কৰিব পাৰে।",
};

const bengali = {
  back: "ফিরে যান", next: "পরেরটি", previous: "আগেরটি", save: "সংরক্ষণ করুন", saveChanges: "পরিবর্তন সংরক্ষণ করুন", cancel: "বাতিল করুন", close: "বন্ধ করুন", edit: "সম্পাদনা করুন", delete: "মুছে দিন", loading: "লোড হচ্ছে…", error: "ত্রুটি", success: "সফল", retry: "আবার চেষ্টা করুন", submit: "জমা দিন", search: "খুঁজুন", patient: "রোগী", caregiver: "যত্নদাতা", elder: "প্রবীণ", age: "বয়স", gender: "লিঙ্গ", language: "ভাষা", connected: "সংযুক্ত", connection: "সংযোগ", messages: "বার্তা", reminder: "স্মরণিকা", reminders: "স্মরণিকাগুলি", active: "সক্রিয়", inactive: "নিষ্ক্রিয়", yes: "হ্যাঁ", no: "না", score: "স্কোর", accuracy: "নির্ভুলতা", level: "স্তর", complete: "সম্পূর্ণ করুন", completed: "সম্পূর্ণ হয়েছে", start: "শুরু করুন", continue: "চালিয়ে যান", replay: "আবার চালান", noData: "কোনো তথ্য নেই।", noResults: "কোনো ফল পাওয়া যায়নি।", noReminders: "এখনও কোনো স্মরণিকা নেই।", noMessages: "এখনও কোনো বার্তা নেই।", noConnections: "এখনও কোনো সংযোগ নেই।", noActivity: "এখনও কোনো কার্যকলাপ নেই।", tryAgain: "অনুগ্রহ করে আবার চেষ্টা করুন।", confirm: "নিশ্চিত করুন", confirmDelete: "আপনি কি এটি মুছে দিতে চান?", confirmRemove: "আপনি কি এটি সরাতে চান?", somethingWentWrong: "কিছু ভুল হয়েছে।", unableToLoad: "এই তথ্য লোড করা যায়নি।", unableToSave: "আপনার পরিবর্তন সংরক্ষণ করা যায়নি।", savedSuccessfully: "সফলভাবে সংরক্ষণ করা হয়েছে।", updatedSuccessfully: "সফলভাবে হালনাগাদ করা হয়েছে।", deletedSuccessfully: "সফলভাবে মুছে দেওয়া হয়েছে।", pleaseWait: "অনুগ্রহ করে অপেক্ষা করুন…", searching: "খোঁজা হচ্ছে…", notFound: "পাওয়া যায়নি।", optional: "ঐচ্ছিক", today: "আজ", date: "তারিখ", time: "সময়", status: "অবস্থা", details: "বিস্তারিত", view: "দেখুন", manage: "পরিচালনা করুন", home: "হোম", logout: "লগ আউট", accept: "গ্রহণ করুন", reject: "প্রত্যাখ্যান করুন", decline: "না বলুন", remove: "সরান", add: "যোগ করুন", create: "তৈরি করুন", update: "হালনাগাদ করুন", select: "নির্বাচন করুন", all: "সব", none: "কোনোটিই নয়",
  elderMessages: "প্রবীণদের বার্তা", connectedElders: "সংযুক্ত প্রবীণরা", noElderConnections: "এখনও কোনো প্রবীণ সংযোগ নেই।", playVoiceMessage: "ভয়েস বার্তা শুনুন", startConversation: "স্নেহের সঙ্গে কথা শুরু করুন।", writeMessage: "বার্তা লিখুন", send: "পাঠান", recordVoiceMessage: "ভয়েস বার্তা রেকর্ড করুন", stopAndSendVoiceMessage: "থামান ও ভয়েস বার্তা পাঠান", sendingVoiceMessage: "ভয়েস বার্তা পাঠানো হচ্ছে…", selectElder: "বার্তা শুরু করতে একজন প্রবীণকে বেছে নিন।", profile: "আমার প্রোফাইল", patientAccount: "রোগীর অ্যাকাউন্ট", viewProfile: "আপনার ব্যক্তিগত তথ্য দেখুন ও পরিচালনা করুন।", editProfile: "প্রোফাইল সম্পাদনা করুন", name: "নাম", caregiverName: "যত্নদাতার নাম", caregiverPhone: "যত্নদাতার ফোন", notProvided: "দেওয়া হয়নি", connectionRequests: "নতুন সংযোগের অনুরোধ", supportYou: "কেউ আপনাকে সাহায্য করতে চান", verifiedCaregiver: "যাচাইকৃত যত্নদাতা", caregiverRequest: "আপনার যত্নদাতা হিসেবে যুক্ত হতে চান।", notNow: "এখন নয়", acceptRequest: "অনুরোধ গ্রহণ করুন", connectionPrivacy: "আপনার অগ্রগতি কে দেখতে পারবেন তা আপনি ঠিক করেন। পরে সংযোগ পরিচালনা করতে পারবেন।",
};

const nagamese = {
  back: "Ghuribo", next: "Agor phale", previous: "Agor tu", save: "Save koribo", saveChanges: "Changes save koribo", cancel: "Cancel koribo", close: "Bondho koribo", edit: "Edit koribo", delete: "Hatai dibo", loading: "Load hoi ase…", error: "Bhool", success: "Hoishe", retry: "Aru ekbar try koribo", submit: "Joma dibo", search: "Bisari sabi", patient: "Patient", caregiver: "Caregiver", elder: "Bura manu", age: "Boiokh", gender: "Linggo", language: "Bhasa", connected: "Connected", connection: "Connection", messages: "Messages", reminder: "Monot korai diya", reminders: "Monot korai diya khan", active: "Active", inactive: "Inactive", yes: "Hoi", no: "Nohoi", score: "Score", accuracy: "Thik thaka", level: "Level", complete: "Pura koribo", completed: "Pura hoishe", start: "Shuru koribo", continue: "Agai jabo", replay: "Aru ekbar hunibo", noData: "Kunu data nai.", noResults: "Kunu result pua nai.", noReminders: "Etiya kunu monot korai diya nai.", noMessages: "Etiya kunu message nai.", noConnections: "Etiya kunu connection nai.", noActivity: "Etiya kunu activity nai.", tryAgain: "Doya kori aru ekbar try koribo.", confirm: "Nischit koribo", confirmDelete: "Apuni eitu hatai dibo niki?", confirmRemove: "Apuni eitu ulai dibo niki?", somethingWentWrong: "Kiba bhool hoishe.", unableToLoad: "Ei information load hobo nai.", unableToSave: "Apunar changes save hobo nai.", savedSuccessfully: "Bhalke save hoishe.", updatedSuccessfully: "Bhalke update hoishe.", deletedSuccessfully: "Bhalke hatai dise.", pleaseWait: "Olop rukhibo…", searching: "Bisari ase…", notFound: "Pua nai.", optional: "Mon jai hole", today: "Aji", date: "Tarikh", time: "Somoi", status: "Obostha", details: "Bistar", view: "Sabo", manage: "Manage koribo", home: "Home", logout: "Log out", accept: "Accept koribo", reject: "Reject koribo", decline: "No koribo", remove: "Ulaibo", add: "Joribo", create: "Bonabo", update: "Update koribo", select: "Bachibo", all: "Sob", none: "Ektao nai",
  elderMessages: "Bura manu messages", connectedElders: "Connected bura manu", noElderConnections: "Etiya bura manu connection nai.", playVoiceMessage: "Voice message hunibo", startConversation: "Morom logot kotha pati shuru koribo.", writeMessage: "Message likhibo", send: "Pathabo", recordVoiceMessage: "Voice message record koribo", stopAndSendVoiceMessage: "Rukhai voice message pathabo", sendingVoiceMessage: "Voice message pathai ase…", selectElder: "Message shuru koribole ekjon bura manu bachibo.", profile: "Mur profile", patientAccount: "Patient account", viewProfile: "Apunar nijor information sabo aru manage koribo.", editProfile: "Profile edit koribo", name: "Naam", caregiverName: "Caregiver naam", caregiverPhone: "Caregiver phone", notProvided: "Dibo nai", connectionRequests: "Notun connection request", supportYou: "Kunuba apunak help koribo bisare", verifiedCaregiver: "Verified caregiver", caregiverRequest: "Apunar caregiver hisape connect koribo bisare.", notNow: "Etiya nohoi", acceptRequest: "Request accept koribo", connectionPrivacy: "Apunar progress kun dekhibo pare, apuni decide kore. Connection pisote manage koribo paribo.",
};

const patientProfileEnglish = {
  loadingProfile: "Loading profile…", failedToLoadProfile: "Failed to load patient profile",
  patientAccountInformationMissing: "Patient account information is missing.", patientProfileNotFound: "Patient profile not found.",
  failedToUpdateProfile: "Failed to update profile", profileUpdatedSuccessfully: "Profile updated successfully.",
  years: "years", yearsOld: "years old", cognitiveLevel: "Cognitive Level", caregiverInformation: "Caregiver Information",
  phoneNumberNotProvided: "Phone number not provided", accountStatus: "Account Status",
  updatePatientInformation: "Update Patient Information", female: "Female", male: "Male", other: "Other",
};
const patientProfileHindi = {
  loadingProfile: "प्रोफ़ाइल लोड हो रही है…", failedToLoadProfile: "रोगी प्रोफ़ाइल लोड नहीं हो सकी",
  patientAccountInformationMissing: "रोगी खाते की जानकारी उपलब्ध नहीं है।", patientProfileNotFound: "रोगी प्रोफ़ाइल नहीं मिली।",
  failedToUpdateProfile: "प्रोफ़ाइल बदली नहीं जा सकी", profileUpdatedSuccessfully: "प्रोफ़ाइल सफलतापूर्वक बदल दी गई।",
  years: "वर्ष", yearsOld: "वर्ष के", cognitiveLevel: "संज्ञानात्मक स्तर", caregiverInformation: "देखभालकर्ता की जानकारी",
  phoneNumberNotProvided: "फ़ोन नंबर उपलब्ध नहीं है", accountStatus: "खाते की स्थिति",
  updatePatientInformation: "रोगी की जानकारी बदलें", female: "महिला", male: "पुरुष", other: "अन्य",
};
const patientProfileTelugu = {
  loadingProfile: "ప్రొఫైల్ లోడ్ అవుతోంది…", failedToLoadProfile: "రోగి ప్రొఫైల్ లోడ్ కాలేదు",
  patientAccountInformationMissing: "రోగి ఖాతా సమాచారం అందుబాటులో లేదు.", patientProfileNotFound: "రోగి ప్రొఫైల్ కనిపించలేదు.",
  failedToUpdateProfile: "ప్రొఫైల్ నవీకరించబడలేదు", profileUpdatedSuccessfully: "ప్రొఫైల్ విజయవంతంగా నవీకరించబడింది.",
  years: "సంవత్సరాలు", yearsOld: "సంవత్సరాల వయస్సు", cognitiveLevel: "జ్ఞాన స్థాయి", caregiverInformation: "సంరక్షకుని సమాచారం",
  phoneNumberNotProvided: "ఫోన్ నంబర్ అందించలేదు", accountStatus: "ఖాతా స్థితి",
  updatePatientInformation: "రోగి సమాచారాన్ని నవీకరించండి", female: "స్త్రీ", male: "పురుషుడు", other: "ఇతర",
};
const patientProfileAssamese = {
  loadingProfile: "প্ৰ'ফাইল লোড হৈ আছে…", failedToLoadProfile: "ৰোগীৰ প্ৰ'ফাইল লোড কৰিব নোৱাৰিলে",
  patientAccountInformationMissing: "ৰোগীৰ একাউণ্টৰ তথ্য উপলব্ধ নাই।", patientProfileNotFound: "ৰোগীৰ প্ৰ'ফাইল পোৱা নগ'ল।",
  failedToUpdateProfile: "প্ৰ'ফাইল সংশোধন কৰিব নোৱাৰিলে", profileUpdatedSuccessfully: "প্ৰ'ফাইল সফলতাৰে সংশোধন কৰা হ'ল।",
  years: "বছৰ", yearsOld: "বছৰ বয়স", cognitiveLevel: "জ্ঞানীয় স্তৰ", caregiverInformation: "যত্নদাতাৰ তথ্য",
  phoneNumberNotProvided: "ফোন নম্বৰ দিয়া হোৱা নাই", accountStatus: "একাউণ্টৰ অৱস্থা",
  updatePatientInformation: "ৰোগীৰ তথ্য সংশোধন কৰক", female: "মহিলা", male: "পুৰুষ", other: "অন্যান্য",
};
const patientProfileBengali = {
  loadingProfile: "প্রোফাইল লোড হচ্ছে…", failedToLoadProfile: "রোগীর প্রোফাইল লোড করা যায়নি",
  patientAccountInformationMissing: "রোগীর অ্যাকাউন্টের তথ্য নেই।", patientProfileNotFound: "রোগীর প্রোফাইল পাওয়া যায়নি।",
  failedToUpdateProfile: "প্রোফাইল হালনাগাদ করা যায়নি", profileUpdatedSuccessfully: "প্রোফাইল সফলভাবে হালনাগাদ করা হয়েছে।",
  years: "বছর", yearsOld: "বছর বয়স", cognitiveLevel: "জ্ঞানীয় স্তর", caregiverInformation: "যত্নদাতার তথ্য",
  phoneNumberNotProvided: "ফোন নম্বর দেওয়া হয়নি", accountStatus: "অ্যাকাউন্টের অবস্থা",
  updatePatientInformation: "রোগীর তথ্য হালনাগাদ করুন", female: "মহিলা", male: "পুরুষ", other: "অন্যান্য",
};
const patientProfileNagamese = {
  loadingProfile: "Profile load hoi ase…", failedToLoadProfile: "Patient profile load hobo nai",
  patientAccountInformationMissing: "Patient account information nai.", patientProfileNotFound: "Patient profile pua nai.",
  failedToUpdateProfile: "Profile update hobo nai", profileUpdatedSuccessfully: "Profile bhalke update hoishe.",
  years: "bosor", yearsOld: "bosor boiokh", cognitiveLevel: "Monor level", caregiverInformation: "Caregiver information",
  phoneNumberNotProvided: "Phone number dibo nai", accountStatus: "Account obostha",
  updatePatientInformation: "Patient information update koribo", female: "Meye", male: "Mota", other: "Anya",
};

const patientReminderListEnglish = {
  patientReminders: "Patient Reminders", myReminders: "My Reminders",
  reminderPageDescription: "View your scheduled medicines, activities, hydration, and appointments.",
  todaysRoutine: "Today's routine", activeReminder: "active reminder", activeReminders: "active reminders",
  caregiverHasNotAddedReminders: "Your caregiver has not added any reminders yet.",
  medicine: "Medicine", hydration: "Hydration", dailyActivity: "Daily Activity", appointment: "Appointment",
  everyDay: "Every day", everyWeek: "Every week", once: "Once",
  loadingReminders: "Loading reminders…", failedToLoadReminders: "Failed to load reminders",
  unableToLoadReminders: "Unable to load reminders.",
};
const patientReminderListHindi = {
  patientReminders: "रोगी रिमाइंडर", myReminders: "मेरे रिमाइंडर",
  reminderPageDescription: "अपनी तय दवाइयाँ, गतिविधियाँ, पानी पीने के रिमाइंडर और अपॉइंटमेंट देखें।",
  todaysRoutine: "आज की दिनचर्या", activeReminder: "सक्रिय रिमाइंडर", activeReminders: "सक्रिय रिमाइंडर",
  caregiverHasNotAddedReminders: "आपके देखभालकर्ता ने अभी कोई रिमाइंडर नहीं जोड़ा है।",
  medicine: "दवा", hydration: "पानी पीना", dailyActivity: "दैनिक गतिविधि", appointment: "अपॉइंटमेंट",
  everyDay: "हर दिन", everyWeek: "हर सप्ताह", once: "एक बार",
  loadingReminders: "रिमाइंडर लोड हो रहे हैं…", failedToLoadReminders: "रिमाइंडर लोड नहीं हो सके",
  unableToLoadReminders: "रिमाइंडर लोड नहीं हो सके।",
};
const patientReminderListTelugu = {
  patientReminders: "రోగి గుర్తుచూపులు", myReminders: "నా గుర్తుచూపులు",
  reminderPageDescription: "మీ నిర్ణయించిన మందులు, కార్యకలాపాలు, నీరు తాగే గుర్తుచూపులు మరియు అపాయింట్‌మెంట్‌లను చూడండి.",
  todaysRoutine: "ఈ రోజు దినచర్య", activeReminder: "సక్రియ గుర్తుచూపు", activeReminders: "సక్రియ గుర్తుచూపులు",
  caregiverHasNotAddedReminders: "మీ సంరక్షకుడు ఇంకా గుర్తుచూపులను జోడించలేదు.",
  medicine: "మందు", hydration: "నీరు తాగడం", dailyActivity: "రోజువారీ కార్యకలాపం", appointment: "అపాయింట్‌మెంట్",
  everyDay: "ప్రతి రోజు", everyWeek: "ప్రతి వారం", once: "ఒకసారి",
  loadingReminders: "గుర్తుచూపులు లోడ్ అవుతున్నాయి…", failedToLoadReminders: "గుర్తుచూపులు లోడ్ కాలేదు",
  unableToLoadReminders: "గుర్తుచూపులు లోడ్ కాలేదు.",
};
const patientReminderListAssamese = {
  patientReminders: "ৰোগীৰ সোঁৱৰণী", myReminders: "মোৰ সোঁৱৰণীসমূহ",
  reminderPageDescription: "আপোনাৰ নিৰ্ধাৰিত ঔষধ, কাৰ্যকলাপ, পানী খোৱাৰ সোঁৱৰণী আৰু এপইণ্টমেণ্ট চাওক।",
  todaysRoutine: "আজিৰ দিনচৰ্যা", activeReminder: "সক্ৰিয় সোঁৱৰণী", activeReminders: "সক্ৰিয় সোঁৱৰণীসমূহ",
  caregiverHasNotAddedReminders: "আপোনাৰ যত্নদাতাই এতিয়াও কোনো সোঁৱৰণী যোগ কৰা নাই।",
  medicine: "ঔষধ", hydration: "পানী খোৱা", dailyActivity: "দৈনন্দিন কাৰ্যকলাপ", appointment: "এপইণ্টমেণ্ট",
  everyDay: "প্ৰতিদিনে", everyWeek: "প্ৰতি সপ্তাহে", once: "এবাৰ",
  loadingReminders: "সোঁৱৰণীসমূহ লোড হৈ আছে…", failedToLoadReminders: "সোঁৱৰণীসমূহ লোড কৰিব নোৱাৰিলে",
  unableToLoadReminders: "সোঁৱৰণীসমূহ লোড কৰিব নোৱাৰিলে।",
};
const patientReminderListBengali = {
  patientReminders: "রোগীর স্মরণিকা", myReminders: "আমার স্মরণিকা",
  reminderPageDescription: "আপনার নির্ধারিত ওষুধ, কাজ, পানি পান করার স্মরণিকা ও অ্যাপয়েন্টমেন্ট দেখুন।",
  todaysRoutine: "আজকের রুটিন", activeReminder: "সক্রিয় স্মরণিকা", activeReminders: "সক্রিয় স্মরণিকাগুলি",
  caregiverHasNotAddedReminders: "আপনার যত্নদাতা এখনও কোনো স্মরণিকা যোগ করেননি।",
  medicine: "ওষুধ", hydration: "পানি পান", dailyActivity: "দৈনন্দিন কাজ", appointment: "অ্যাপয়েন্টমেন্ট",
  everyDay: "প্রতিদিন", everyWeek: "প্রতি সপ্তাহে", once: "একবার",
  loadingReminders: "স্মরণিকা লোড হচ্ছে…", failedToLoadReminders: "স্মরণিকা লোড করা যায়নি",
  unableToLoadReminders: "স্মরণিকা লোড করা যায়নি।",
};
const patientReminderListNagamese = {
  patientReminders: "Patient monot korai diya", myReminders: "Mur monot korai diya",
  reminderPageDescription: "Apunar thik kora dawa, activity, pani khabo monot korai diya aru appointment sabi.",
  todaysRoutine: "Ajir routine", activeReminder: "active monot korai diya", activeReminders: "active monot korai diya khan",
  caregiverHasNotAddedReminders: "Apunar caregiver etiya kunu monot korai diya jorai nai.",
  medicine: "Dawa", hydration: "Pani khabo", dailyActivity: "Rozor activity", appointment: "Appointment",
  everyDay: "Protidin", everyWeek: "Proti hapta", once: "Ekbar",
  loadingReminders: "Monot korai diya load hoi ase…", failedToLoadReminders: "Monot korai diya load hobo nai",
  unableToLoadReminders: "Monot korai diya load hobo nai.",
};

const patientReminderOverlayEnglish = { gotIt: "Got It" };
const patientReminderOverlayHindi = { gotIt: "समझ गया" };
const patientReminderOverlayTelugu = { gotIt: "అర్థమైంది" };
const patientReminderOverlayAssamese = { gotIt: "বুজিলোঁ" };
const patientReminderOverlayBengali = { gotIt: "বুঝেছি" };
const patientReminderOverlayNagamese = { gotIt: "Bujhi paisu" };

const reminderManagerEnglish = {
  authenticationRequired: "Authentication required.", failedToLoadConnectedPatients: "Failed to load connected patients",
  noAcceptedPatientsConnected: "No accepted patients are connected to this caregiver.", titleAndCompleteTimeRequired: "Title and a complete time are required.",
  failedToCreateReminder: "Failed to create reminder", failedToUpdateReminder: "Failed to update reminder",
  reminderCreatedSuccessfully: "Reminder created successfully.", reminderUpdatedSuccessfully: "Reminder updated successfully.",
  failedToDeleteReminder: "Failed to delete reminder", reminderDeletedSuccessfully: "Reminder deleted successfully.",
  backToDashboard: "Back to dashboard", caregiverTools: "Caregiver Tools",
  reminderManagerDescription: "Plan gentle prompts for medicines, hydration, activities and appointments.",
  reminderOverview: "Reminder overview", editReminder: "Edit Reminder", createReminder: "Create Reminder",
  updateReminderDetails: "Update the details", setNewReminder: "Set a new reminder", reminderType: "Reminder type",
  title: "Title", description: "Description", exampleMorningMedicine: "Example: Morning medicine",
  addSimpleInstructions: "Add simple instructions", hour: "Hour", minute: "Minute", hourPlaceholder: "HH", minutePlaceholder: "MM", repeat: "Repeat",
  cancelEditing: "Cancel editing", activeRemindersHeading: "Active Reminders", yourCareSchedule: "Your care schedule",
  createFirstReminder: "Create the first reminder to help your patient stay on track.",
};
const reminderManagerHindi = {
  authenticationRequired: "पहचान की पुष्टि आवश्यक है।", failedToLoadConnectedPatients: "जुड़े हुए रोगियों को लोड नहीं किया जा सका",
  noAcceptedPatientsConnected: "इस देखभालकर्ता से कोई स्वीकृत रोगी नहीं जुड़ा है।", titleAndCompleteTimeRequired: "शीर्षक और पूरा समय देना आवश्यक है।",
  failedToCreateReminder: "रिमाइंडर बनाया नहीं जा सका", failedToUpdateReminder: "रिमाइंडर बदला नहीं जा सका",
  reminderCreatedSuccessfully: "रिमाइंडर सफलतापूर्वक बना दिया गया।", reminderUpdatedSuccessfully: "रिमाइंडर सफलतापूर्वक बदल दिया गया।",
  failedToDeleteReminder: "रिमाइंडर हटाया नहीं जा सका", reminderDeletedSuccessfully: "रिमाइंडर सफलतापूर्वक हटा दिया गया।",
  backToDashboard: "डैशबोर्ड पर वापस जाएँ", caregiverTools: "देखभालकर्ता के साधन",
  reminderManagerDescription: "दवाइयों, पानी पीने, गतिविधियों और अपॉइंटमेंट के लिए सरल याद दिलाने की सूचना बनाएँ।",
  reminderOverview: "रिमाइंडर का सार", editReminder: "रिमाइंडर बदलें", createReminder: "रिमाइंडर बनाएँ",
  updateReminderDetails: "जानकारी बदलें", setNewReminder: "नया रिमाइंडर बनाएँ", reminderType: "रिमाइंडर का प्रकार",
  title: "शीर्षक", description: "विवरण", exampleMorningMedicine: "उदाहरण: सुबह की दवा",
  addSimpleInstructions: "सरल निर्देश जोड़ें", hour: "घंटा", minute: "मिनट", hourPlaceholder: "HH", minutePlaceholder: "MM", repeat: "दोहराएँ",
  cancelEditing: "बदलाव रद्द करें", activeRemindersHeading: "सक्रिय रिमाइंडर", yourCareSchedule: "आपकी देखभाल की समय-सारिणी",
  createFirstReminder: "अपने रोगी को समय पर रखने में मदद के लिए पहला रिमाइंडर बनाएँ।",
};
const reminderManagerTelugu = {
  authenticationRequired: "గుర్తింపు నిర్ధారణ అవసరం.", failedToLoadConnectedPatients: "కనెక్ట్ అయిన రోగులను లోడ్ చేయలేకపోయాము",
  noAcceptedPatientsConnected: "ఈ సంరక్షకుడికి అంగీకరించిన రోగులు ఎవరూ కనెక్ట్ కాలేదు.", titleAndCompleteTimeRequired: "శీర్షిక మరియు పూర్తి సమయం అవసరం.",
  failedToCreateReminder: "గుర్తుచూపు సృష్టించబడలేదు", failedToUpdateReminder: "గుర్తుచూపు నవీకరించబడలేదు",
  reminderCreatedSuccessfully: "గుర్తుచూపు విజయవంతంగా సృష్టించబడింది.", reminderUpdatedSuccessfully: "గుర్తుచూపు విజయవంతంగా నవీకరించబడింది.",
  failedToDeleteReminder: "గుర్తుచూపు తొలగించబడలేదు", reminderDeletedSuccessfully: "గుర్తుచూపు విజయవంతంగా తొలగించబడింది.",
  backToDashboard: "డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి", caregiverTools: "సంరక్షకుని సాధనాలు",
  reminderManagerDescription: "మందులు, నీరు తాగడం, కార్యకలాపాలు మరియు అపాయింట్‌మెంట్‌ల కోసం మృదువైన గుర్తుచూపులను ప్లాన్ చేయండి.",
  reminderOverview: "గుర్తుచూపు సారాంశం", editReminder: "గుర్తుచూపును సవరించండి", createReminder: "గుర్తుచూపును సృష్టించండి",
  updateReminderDetails: "వివరాలను నవీకరించండి", setNewReminder: "కొత్త గుర్తుచూపును సెట్ చేయండి", reminderType: "గుర్తుచూపు రకం",
  title: "శీర్షిక", description: "వివరణ", exampleMorningMedicine: "ఉదాహరణ: ఉదయం మందు",
  addSimpleInstructions: "సులభమైన సూచనలు జోడించండి", hour: "గంట", minute: "నిమిషం", hourPlaceholder: "HH", minutePlaceholder: "MM", repeat: "పునరావృతం",
  cancelEditing: "సవరణను రద్దు చేయండి", activeRemindersHeading: "సక్రియ గుర్తుచూపులు", yourCareSchedule: "మీ సంరక్షణ సమయపట్టిక",
  createFirstReminder: "మీ రోగి క్రమంలో ఉండేందుకు సహాయంగా మొదటి గుర్తుచూపును సృష్టించండి.",
};
const reminderManagerAssamese = {
  authenticationRequired: "পৰিচয় নিশ্চিতকৰণ প্ৰয়োজন।", failedToLoadConnectedPatients: "সংযুক্ত ৰোগীসকল লোড কৰিব নোৱাৰিলে",
  noAcceptedPatientsConnected: "এই যত্নদাতাৰ সৈতে কোনো স্বীকৃত ৰোগী সংযুক্ত নাই।", titleAndCompleteTimeRequired: "শিৰোনাম আৰু সম্পূৰ্ণ সময় দিয়াটো প্ৰয়োজন।",
  failedToCreateReminder: "সোঁৱৰণী সৃষ্টি কৰিব নোৱাৰিলে", failedToUpdateReminder: "সোঁৱৰণী সংশোধন কৰিব নোৱাৰিলে",
  reminderCreatedSuccessfully: "সোঁৱৰণী সফলতাৰে সৃষ্টি কৰা হ'ল।", reminderUpdatedSuccessfully: "সোঁৱৰণী সফলতাৰে সংশোধন কৰা হ'ল।",
  failedToDeleteReminder: "সোঁৱৰণী মচি পেলাব নোৱাৰিলে", reminderDeletedSuccessfully: "সোঁৱৰণী সফলতাৰে মচি পেলোৱা হ'ল।",
  backToDashboard: "ডেশ্বব'ৰ্ডলৈ উভতি যাওক", caregiverTools: "যত্নদাতাৰ সঁজুলি",
  reminderManagerDescription: "ঔষধ, পানী খোৱা, কাৰ্যকলাপ আৰু এপইণ্টমেণ্টৰ বাবে কোমল সোঁৱৰণী পৰিকল্পনা কৰক।",
  reminderOverview: "সোঁৱৰণীৰ সাৰাংশ", editReminder: "সোঁৱৰণী সম্পাদনা কৰক", createReminder: "সোঁৱৰণী সৃষ্টি কৰক",
  updateReminderDetails: "বিৱৰণ সংশোধন কৰক", setNewReminder: "নতুন সোঁৱৰণী ঠিক কৰক", reminderType: "সোঁৱৰণীৰ ধৰণ",
  title: "শিৰোনাম", description: "বিৱৰণ", exampleMorningMedicine: "উদাহৰণ: পুৱাৰ ঔষধ",
  addSimpleInstructions: "সহজ নিৰ্দেশ যোগ কৰক", hour: "ঘণ্টা", minute: "মিনিট", hourPlaceholder: "HH", minutePlaceholder: "MM", repeat: "পুনৰাবৃত্তি",
  cancelEditing: "সম্পাদনা বাতিল কৰক", activeRemindersHeading: "সক্ৰিয় সোঁৱৰণীসমূহ", yourCareSchedule: "আপোনাৰ যত্নৰ সময়সূচী",
  createFirstReminder: "আপোনাৰ ৰোগীক সঠিক পথত ৰাখিবলৈ সহায়ৰ বাবে প্ৰথম সোঁৱৰণী সৃষ্টি কৰক।",
};
const reminderManagerBengali = {
  authenticationRequired: "পরিচয় যাচাই প্রয়োজন।", failedToLoadConnectedPatients: "সংযুক্ত রোগীদের লোড করা যায়নি",
  noAcceptedPatientsConnected: "এই যত্নদাতার সঙ্গে কোনো অনুমোদিত রোগী যুক্ত নেই।", titleAndCompleteTimeRequired: "শিরোনাম ও সম্পূর্ণ সময় দেওয়া প্রয়োজন।",
  failedToCreateReminder: "স্মরণিকা তৈরি করা যায়নি", failedToUpdateReminder: "স্মরণিকা হালনাগাদ করা যায়নি",
  reminderCreatedSuccessfully: "স্মরণিকা সফলভাবে তৈরি করা হয়েছে।", reminderUpdatedSuccessfully: "স্মরণিকা সফলভাবে হালনাগাদ করা হয়েছে।",
  failedToDeleteReminder: "স্মরণিকা মুছে দেওয়া যায়নি", reminderDeletedSuccessfully: "স্মরণিকা সফলভাবে মুছে দেওয়া হয়েছে।",
  backToDashboard: "ড্যাশবোর্ডে ফিরে যান", caregiverTools: "যত্নদাতার সরঞ্জাম",
  reminderManagerDescription: "ওষুধ, পানি পান, কাজ এবং অ্যাপয়েন্টমেন্টের জন্য সহজ স্মরণিকা পরিকল্পনা করুন।",
  reminderOverview: "স্মরণিকার সারাংশ", editReminder: "স্মরণিকা সম্পাদনা করুন", createReminder: "স্মরণিকা তৈরি করুন",
  updateReminderDetails: "বিস্তারিত হালনাগাদ করুন", setNewReminder: "নতুন স্মরণিকা ঠিক করুন", reminderType: "স্মরণিকার ধরন",
  title: "শিরোনাম", description: "বিবরণ", exampleMorningMedicine: "উদাহরণ: সকালের ওষুধ",
  addSimpleInstructions: "সহজ নির্দেশ যোগ করুন", hour: "ঘণ্টা", minute: "মিনিট", hourPlaceholder: "HH", minutePlaceholder: "MM", repeat: "পুনরাবৃত্তি",
  cancelEditing: "সম্পাদনা বাতিল করুন", activeRemindersHeading: "সক্রিয় স্মরণিকাগুলি", yourCareSchedule: "আপনার যত্নের সময়সূচী",
  createFirstReminder: "আপনার রোগীকে নিয়মে রাখতে সাহায্য করতে প্রথম স্মরণিকা তৈরি করুন।",
};
const reminderManagerNagamese = {
  authenticationRequired: "Authentication lage.", failedToLoadConnectedPatients: "Connected patient khan load hobo nai",
  noAcceptedPatientsConnected: "Ei caregiver logot accepted patient kunu connect nai.", titleAndCompleteTimeRequired: "Title aru pura time diba lage.",
  failedToCreateReminder: "Monot korai diya bonabo nai", failedToUpdateReminder: "Monot korai diya update hobo nai",
  reminderCreatedSuccessfully: "Monot korai diya bhalke bonai dise.", reminderUpdatedSuccessfully: "Monot korai diya bhalke update hoishe.",
  failedToDeleteReminder: "Monot korai diya hatai dibo nai", reminderDeletedSuccessfully: "Monot korai diya bhalke hatai dise.",
  backToDashboard: "Dashboard te ghuribo", caregiverTools: "Caregiver tools",
  reminderManagerDescription: "Dawa, pani khabo, activity aru appointment nimite komol monot korai diya plan koribo.",
  reminderOverview: "Monot korai diya overview", editReminder: "Monot korai diya edit koribo", createReminder: "Monot korai diya bonabo",
  updateReminderDetails: "Details update koribo", setNewReminder: "Notun monot korai diya set koribo", reminderType: "Monot korai diya type",
  title: "Title", description: "Description", exampleMorningMedicine: "Example: Pua dawa",
  addSimpleInstructions: "Simple instructions joribo", hour: "Ghonta", minute: "Minute", hourPlaceholder: "HH", minutePlaceholder: "MM", repeat: "Aru koribo",
  cancelEditing: "Editing cancel koribo", activeRemindersHeading: "Active monot korai diya khan", yourCareSchedule: "Apunar care schedule",
  createFirstReminder: "Apunar patient ke track te thakibo help koribole first monot korai diya bonabo.",
};

const adminPatientLinkEnglish = {
  loadingManagementPanel: "Loading management panel…", adminManagement: "Admin Management",
  caregiverPatientLinking: "Caregiver & Patient Linking", assignPatientToCaregiver: "Assign a patient to the caregiver responsible for their care.",
  failedToLoadCaregivers: "Failed to load caregivers", failedToLoadPatients: "Failed to load patients",
  selectCaregiverAndPatient: "Please select both a caregiver and a patient.", failedToLinkPatient: "Failed to link patient",
  patientLinkedSuccessfully: "Patient linked to caregiver successfully.", selectCaregiver: "Select Caregiver",
  chooseCaregiver: "Choose caregiver", selectPatient: "Select Patient", choosePatient: "Choose patient",
  linking: "Linking…", linkPatient: "Link Patient",
};
const adminPatientLinkHindi = {
  loadingManagementPanel: "प्रबंधन पैनल लोड हो रहा है…", adminManagement: "प्रशासक प्रबंधन",
  caregiverPatientLinking: "देखभालकर्ता और रोगी को जोड़ें", assignPatientToCaregiver: "रोगी को उसकी देखभाल के लिए जिम्मेदार देखभालकर्ता से जोड़ें।",
  failedToLoadCaregivers: "देखभालकर्ताओं को लोड नहीं किया जा सका", failedToLoadPatients: "रोगियों को लोड नहीं किया जा सका",
  selectCaregiverAndPatient: "कृपया एक देखभालकर्ता और एक रोगी चुनें।", failedToLinkPatient: "रोगी को जोड़ा नहीं जा सका",
  patientLinkedSuccessfully: "रोगी को देखभालकर्ता से सफलतापूर्वक जोड़ दिया गया।", selectCaregiver: "देखभालकर्ता चुनें",
  chooseCaregiver: "देखभालकर्ता चुनें", selectPatient: "रोगी चुनें", choosePatient: "रोगी चुनें",
  linking: "जोड़ा जा रहा है…", linkPatient: "रोगी को जोड़ें",
};
const adminPatientLinkTelugu = {
  loadingManagementPanel: "నిర్వహణ ప్యానెల్ లోడ్ అవుతోంది…", adminManagement: "అడ్మిన్ నిర్వహణ",
  caregiverPatientLinking: "సంరక్షకుడు మరియు రోగిని కలపండి", assignPatientToCaregiver: "రోగిని వారి సంరక్షణకు బాధ్యత వహించే సంరక్షకునికి కేటాయించండి.",
  failedToLoadCaregivers: "సంరక్షకులను లోడ్ చేయలేకపోయాము", failedToLoadPatients: "రోగులను లోడ్ చేయలేకపోయాము",
  selectCaregiverAndPatient: "దయచేసి సంరక్షకుడిని మరియు రోగిని ఎంచుకోండి.", failedToLinkPatient: "రోగిని కలపలేకపోయాము",
  patientLinkedSuccessfully: "రోగిని సంరక్షకునికి విజయవంతంగా కలిపాము.", selectCaregiver: "సంరక్షకుడిని ఎంచుకోండి",
  chooseCaregiver: "సంరక్షకుడిని ఎంచుకోండి", selectPatient: "రోగిని ఎంచుకోండి", choosePatient: "రోగిని ఎంచుకోండి",
  linking: "కలుపుతోంది…", linkPatient: "రోగిని కలపండి",
};
const adminPatientLinkAssamese = {
  loadingManagementPanel: "পৰিচালনা পেনেল লোড হৈ আছে…", adminManagement: "প্ৰশাসক পৰিচালনা",
  caregiverPatientLinking: "যত্নদাতা আৰু ৰোগীক সংযোগ কৰক", assignPatientToCaregiver: "ৰোগীক তেওঁলোকৰ যত্নৰ দায়িত্বত থকা যত্নদাতাৰ সৈতে সংযোগ কৰক।",
  failedToLoadCaregivers: "যত্নদাতাসকলক লোড কৰিব নোৱাৰিলে", failedToLoadPatients: "ৰোগীসকলক লোড কৰিব নোৱাৰিলে",
  selectCaregiverAndPatient: "অনুগ্ৰহ কৰি এজন যত্নদাতা আৰু এজন ৰোগী বাছক।", failedToLinkPatient: "ৰোগীক সংযোগ কৰিব নোৱাৰিলে",
  patientLinkedSuccessfully: "ৰোগীক যত্নদাতাৰ সৈতে সফলতাৰে সংযোগ কৰা হ'ল।", selectCaregiver: "যত্নদাতা বাছক",
  chooseCaregiver: "যত্নদাতা বাছক", selectPatient: "ৰোগী বাছক", choosePatient: "ৰোগী বাছক",
  linking: "সংযোগ কৰা হৈছে…", linkPatient: "ৰোগীক সংযোগ কৰক",
};
const adminPatientLinkBengali = {
  loadingManagementPanel: "পরিচালনা প্যানেল লোড হচ্ছে…", adminManagement: "প্রশাসক পরিচালনা",
  caregiverPatientLinking: "যত্নদাতা ও রোগীকে যুক্ত করুন", assignPatientToCaregiver: "রোগীকে তার যত্নের দায়িত্বে থাকা যত্নদাতার সঙ্গে যুক্ত করুন।",
  failedToLoadCaregivers: "যত্নদাতাদের লোড করা যায়নি", failedToLoadPatients: "রোগীদের লোড করা যায়নি",
  selectCaregiverAndPatient: "অনুগ্রহ করে একজন যত্নদাতা ও একজন রোগী বেছে নিন।", failedToLinkPatient: "রোগীকে যুক্ত করা যায়নি",
  patientLinkedSuccessfully: "রোগীকে যত্নদাতার সঙ্গে সফলভাবে যুক্ত করা হয়েছে।", selectCaregiver: "যত্নদাতা নির্বাচন করুন",
  chooseCaregiver: "যত্নদাতা বেছে নিন", selectPatient: "রোগী নির্বাচন করুন", choosePatient: "রোগী বেছে নিন",
  linking: "যুক্ত করা হচ্ছে…", linkPatient: "রোগীকে যুক্ত করুন",
};
const adminPatientLinkNagamese = {
  loadingManagementPanel: "Management panel load hoi ase…", adminManagement: "Admin management",
  caregiverPatientLinking: "Caregiver aru patient link koribo", assignPatientToCaregiver: "Patient ke taiyar care nimite responsible caregiver logot joribo.",
  failedToLoadCaregivers: "Caregiver khan load hobo nai", failedToLoadPatients: "Patient khan load hobo nai",
  selectCaregiverAndPatient: "Doya kori ekjon caregiver aru ekjon patient bachibo.", failedToLinkPatient: "Patient link hobo nai",
  patientLinkedSuccessfully: "Patient caregiver logot bhalke link hoishe.", selectCaregiver: "Caregiver bachibo",
  chooseCaregiver: "Caregiver bachibo", selectPatient: "Patient bachibo", choosePatient: "Patient bachibo",
  linking: "Link kori ase…", linkPatient: "Patient link koribo",
};

const healthcareEnglish = {
  healthcareWorkerPortal: "Healthcare Worker Portal", assignedPatients: "Assigned patients", authorizedPatientProgress: "Authorized patient progress, activity, and cognitive trends.",
  loadingAssignedPatients: "Loading assigned patients…", loadingAuthorizedPatientData: "Loading authorized patient data…",
  backToAssignedPatients: "Assigned patients", readOnlyAccess: "Read-only access", patientAuthorizedMonitoring: "Patient-authorized monitoring",
  activitySnapshot: "Activity Snapshot", patientOverview: "Patient overview", last7Days: "Last 7 days", completedActivities: "Completed activities",
  averageAccuracy: "Average accuracy", averageScore: "Average score", sessionsThisWeek: "Sessions this week",
  cognitiveStatus: "Cognitive Status", currentTrend: "Current trend", risk: "Risk", sessionsReviewed: "sessions reviewed",
  clinicalGuidance: "Clinical Guidance", alertsNextStep: "Alerts & next step", noPerformanceAlert: "No performance alert",
  noSignificantPerformanceAlert: "Recent activity does not show a significant performance alert.", recommendedFocus: "Recommended focus",
  wellbeing: "Wellbeing", recentMoodCheckIns: "Recent mood check-ins", noMoodCheckIns: "No mood check-ins recorded.",
  activityHistory: "Activity History", recentCompletedSessions: "Recent completed sessions", total: "total",
  noCompletedActivities: "No completed cognitive activities yet.", overallPatientProgress: "Overall patient progress",
  onlyAuthorizedPatients: "Only patients authorized to you are included.", activities: "activities", activePatients: "Active patients",
  improving: "Improving", stable: "Stable", needsAttention: "Needs attention", trend: "Trend", activity: "Activity", authorization: "Authorization",
  assigned: "Assigned", connectPatient: "Connect patient", connectPatientDescription: "Enter a patient code to ask the patient for read-only monitoring authorization.",
  requestPatientAuthorization: "Request patient authorization", patientCodePlaceholder: "Patient code (e.g. MNR-P-ABC123)",
  sendRequest: "Send request", progressMonitoring: "Progress monitoring", openProfile: "Open profile",
  noAssignedPatients: "No patients are currently assigned to you. Request authorization using the patient code above.",
  noActivityRecorded: "No activity recorded", insufficientData: "Insufficient data",
  memoryActivity: "Memory", attentionActivity: "Attention", routineRecallActivity: "Routine recall", patternRecognitionActivity: "Pattern recognition",
  objectRecognitionActivity: "Object recognition", familyFamiliarityActivity: "Family familiarity",
  healthcareServerInvalidResponse: "The healthcare server returned an invalid response. Verify that the backend is running and VITE_API_URL points to it.",
  unableToLoadPatientInformation: "Unable to load patient information.", unableToSendRequest: "Unable to send request.",
};
const healthcareHindi = {
  healthcareWorkerPortal: "स्वास्थ्यकर्मी पोर्टल", assignedPatients: "आवंटित रोगी", authorizedPatientProgress: "अधिकृत रोगियों की प्रगति, गतिविधि और संज्ञानात्मक रुझान।",
  loadingAssignedPatients: "आवंटित रोगी लोड हो रहे हैं…", loadingAuthorizedPatientData: "अधिकृत रोगी की जानकारी लोड हो रही है…",
  backToAssignedPatients: "आवंटित रोगी", readOnlyAccess: "केवल देखने की अनुमति", patientAuthorizedMonitoring: "रोगी द्वारा अधिकृत निगरानी",
  activitySnapshot: "गतिविधि सारांश", patientOverview: "रोगी का सारांश", last7Days: "पिछले 7 दिन", completedActivities: "पूरी की गई गतिविधियाँ",
  averageAccuracy: "औसत सटीकता", averageScore: "औसत स्कोर", sessionsThisWeek: "इस सप्ताह के सत्र",
  cognitiveStatus: "संज्ञानात्मक स्थिति", currentTrend: "वर्तमान रुझान", risk: "जोखिम", sessionsReviewed: "सत्रों की समीक्षा हुई",
  clinicalGuidance: "चिकित्सकीय मार्गदर्शन", alertsNextStep: "सचेतावनी और अगला कदम", noPerformanceAlert: "प्रदर्शन की कोई चेतावनी नहीं",
  noSignificantPerformanceAlert: "हाल की गतिविधि में प्रदर्शन की कोई महत्वपूर्ण चेतावनी नहीं दिखी।", recommendedFocus: "सुझाया गया ध्यान",
  wellbeing: "कल्याण", recentMoodCheckIns: "हाल की मनोदशा जाँच", noMoodCheckIns: "कोई मनोदशा जाँच दर्ज नहीं है।",
  activityHistory: "गतिविधि इतिहास", recentCompletedSessions: "हाल के पूरे हुए सत्र", total: "कुल",
  noCompletedActivities: "अभी कोई संज्ञानात्मक गतिविधि पूरी नहीं हुई है।", overallPatientProgress: "रोगी की कुल प्रगति",
  onlyAuthorizedPatients: "केवल आपके द्वारा अधिकृत रोगी शामिल हैं।", activities: "गतिविधियाँ", activePatients: "सक्रिय रोगी",
  improving: "सुधार हो रहा है", stable: "स्थिर", needsAttention: "ध्यान आवश्यक", trend: "रुझान", activity: "गतिविधि", authorization: "अनुमति",
  assigned: "आवंटित", connectPatient: "रोगी से जुड़ें", connectPatientDescription: "केवल देखने की निगरानी अनुमति के लिए रोगी का कोड दर्ज करें।",
  requestPatientAuthorization: "रोगी से अनुमति माँगें", patientCodePlaceholder: "रोगी कोड (जैसे MNR-P-ABC123)",
  sendRequest: "अनुरोध भेजें", progressMonitoring: "प्रगति निगरानी", openProfile: "प्रोफ़ाइल खोलें",
  noAssignedPatients: "अभी कोई रोगी आपको आवंटित नहीं है। ऊपर दिए रोगी कोड से अनुमति माँगें।",
  noActivityRecorded: "कोई गतिविधि दर्ज नहीं है", insufficientData: "पर्याप्त जानकारी नहीं",
  memoryActivity: "स्मृति", attentionActivity: "ध्यान", routineRecallActivity: "दिनचर्या याद", patternRecognitionActivity: "पैटर्न पहचान",
  objectRecognitionActivity: "वस्तु पहचान", familyFamiliarityActivity: "पारिवारिक परिचय",
  healthcareServerInvalidResponse: "स्वास्थ्य सर्वर से मान्य उत्तर नहीं मिला। बैकएंड और VITE_API_URL जाँचें।",
  unableToLoadPatientInformation: "रोगी की जानकारी लोड नहीं हो सकी।", unableToSendRequest: "अनुरोध भेजा नहीं जा सका।",
};
const healthcareTelugu = {
  healthcareWorkerPortal: "ఆరోగ్య కార్యకర్త పోర్టల్", assignedPatients: "కేటాయించిన రోగులు", authorizedPatientProgress: "అనుమతించిన రోగుల పురోగతి, కార్యకలాపం మరియు జ్ఞాన ధోరణులు.",
  loadingAssignedPatients: "కేటాయించిన రోగులు లోడ్ అవుతున్నారు…", loadingAuthorizedPatientData: "అనుమతించిన రోగి సమాచారం లోడ్ అవుతోంది…",
  backToAssignedPatients: "కేటాయించిన రోగులు", readOnlyAccess: "చూడడానికి మాత్రమే అనుమతి", patientAuthorizedMonitoring: "రోగి అనుమతించిన పర్యవేక్షణ",
  activitySnapshot: "కార్యకలాప సారాంశం", patientOverview: "రోగి సారాంశం", last7Days: "గత 7 రోజులు", completedActivities: "పూర్తయిన కార్యకలాపాలు",
  averageAccuracy: "సగటు ఖచ్చితత్వం", averageScore: "సగటు స్కోర్", sessionsThisWeek: "ఈ వారం సెషన్లు",
  cognitiveStatus: "జ్ఞాన స్థితి", currentTrend: "ప్రస్తుత ధోరణి", risk: "ప్రమాదం", sessionsReviewed: "సెషన్లు సమీక్షించబడ్డాయి",
  clinicalGuidance: "వైద్య మార్గదర్శకం", alertsNextStep: "హెచ్చరికలు మరియు తదుపరి దశ", noPerformanceAlert: "పనితీరు హెచ్చరిక లేదు",
  noSignificantPerformanceAlert: "ఇటీవలి కార్యకలాపంలో ముఖ్యమైన పనితీరు హెచ్చరిక కనిపించలేదు.", recommendedFocus: "సూచించిన దృష్టి",
  wellbeing: "శ్రేయస్సు", recentMoodCheckIns: "ఇటీవలి మానసిక స్థితి తనిఖీలు", noMoodCheckIns: "మానసిక స్థితి తనిఖీలు నమోదు కాలేదు.",
  activityHistory: "కార్యకలాప చరిత్ర", recentCompletedSessions: "ఇటీవలి పూర్తయిన సెషన్లు", total: "మొత్తం",
  noCompletedActivities: "ఇంకా జ్ఞాన కార్యకలాపాలు పూర్తి కాలేదు.", overallPatientProgress: "రోగి మొత్తం పురోగతి",
  onlyAuthorizedPatients: "మీకు అనుమతి ఉన్న రోగులు మాత్రమే చేర్చబడ్డారు.", activities: "కార్యకలాపాలు", activePatients: "సక్రియ రోగులు",
  improving: "మెరుగుపడుతోంది", stable: "స్థిరంగా ఉంది", needsAttention: "శ్రద్ధ అవసరం", trend: "ధోరణి", activity: "కార్యకలాపం", authorization: "అనుమతి",
  assigned: "కేటాయించబడింది", connectPatient: "రోగిని కలపండి", connectPatientDescription: "చూడడానికి మాత్రమే పర్యవేక్షణ అనుమతి కోరడానికి రోగి కోడ్‌ను నమోదు చేయండి.",
  requestPatientAuthorization: "రోగి అనుమతి కోరండి", patientCodePlaceholder: "రోగి కోడ్ (ఉదా. MNR-P-ABC123)",
  sendRequest: "అభ్యర్థన పంపండి", progressMonitoring: "పురోగతి పర్యవేక్షణ", openProfile: "ప్రొఫైల్ తెరవండి",
  noAssignedPatients: "మీకు ప్రస్తుతం రోగులు కేటాయించబడలేదు. పైన ఉన్న రోగి కోడ్‌తో అనుమతి కోరండి.",
  noActivityRecorded: "కార్యకలాపం నమోదు కాలేదు", insufficientData: "తగిన సమాచారం లేదు",
  memoryActivity: "జ్ఞాపకశక్తి", attentionActivity: "శ్రద్ధ", routineRecallActivity: "దినచర్య గుర్తింపు", patternRecognitionActivity: "నమూనా గుర్తింపు",
  objectRecognitionActivity: "వస్తువు గుర్తింపు", familyFamiliarityActivity: "కుటుంబ పరిచయం",
  healthcareServerInvalidResponse: "ఆరోగ్య సర్వర్ సరైన ప్రతిస్పందన ఇవ్వలేదు. బ్యాకెండ్ మరియు VITE_API_URLను తనిఖీ చేయండి.",
  unableToLoadPatientInformation: "రోగి సమాచారాన్ని లోడ్ చేయలేకపోయాము.", unableToSendRequest: "అభ్యర్థన పంపలేకపోయాము.",
};
const healthcareAssamese = {
  healthcareWorkerPortal: "স্বাস্থ্যকৰ্মী প'ৰ্টেল", assignedPatients: "আবণ্টিত ৰোগী", authorizedPatientProgress: "অনুমোদিত ৰোগীৰ অগ্ৰগতি, কাৰ্যকলাপ আৰু জ্ঞানীয় ধাৰা।", loadingAssignedPatients: "আবণ্টিত ৰোগী লোড হৈ আছে…", loadingAuthorizedPatientData: "অনুমোদিত ৰোগীৰ তথ্য লোড হৈ আছে…", backToAssignedPatients: "আবণ্টিত ৰোগী", readOnlyAccess: "কেৱল চাব পৰা সুবিধা", patientAuthorizedMonitoring: "ৰোগীৰ অনুমোদিত নিৰীক্ষণ", activitySnapshot: "কাৰ্যকলাপৰ সাৰাংশ", patientOverview: "ৰোগীৰ সাৰাংশ", last7Days: "যোৱা ৭ দিন", completedActivities: "সম্পূৰ্ণ কৰা কাৰ্যকলাপ", averageAccuracy: "গড় শুদ্ধতা", averageScore: "গড় নম্বৰ", sessionsThisWeek: "এই সপ্তাহৰ সত্র", cognitiveStatus: "জ্ঞানীয় অৱস্থা", currentTrend: "বৰ্তমান ধাৰা", risk: "বিপদ", sessionsReviewed: "সত্র পৰ্যালোচনা কৰা হ'ল", clinicalGuidance: "চিকিৎসা নিৰ্দেশনা", alertsNextStep: "সতৰ্কতা আৰু পৰৱৰ্তী পদক্ষেপ", noPerformanceAlert: "কোনো প্ৰদৰ্শন সতৰ্কতা নাই", noSignificantPerformanceAlert: "শেহতীয়া কাৰ্যকলাপত কোনো উল্লেখযোগ্য প্ৰদৰ্শন সতৰ্কতা দেখা নগ'ল।", recommendedFocus: "পৰামৰ্শ দিয়া মনোযোগ", wellbeing: "সুস্থতা", recentMoodCheckIns: "শেহতীয়া মেজাজ পৰীক্ষা", noMoodCheckIns: "কোনো মেজাজ পৰীক্ষা লিপিবদ্ধ হোৱা নাই।", activityHistory: "কাৰ্যকলাপৰ ইতিহাস", recentCompletedSessions: "শেহতীয়া সম্পূৰ্ণ সত্র", total: "মুঠ", noCompletedActivities: "এতিয়াও কোনো জ্ঞানীয় কাৰ্যকলাপ সম্পূৰ্ণ হোৱা নাই।", overallPatientProgress: "ৰোগীৰ সামগ্ৰিক অগ্ৰগতি", onlyAuthorizedPatients: "কেৱল আপোনাৰ বাবে অনুমোদিত ৰোগীসকল অন্তৰ্ভুক্ত।", activities: "কাৰ্যকলাপ", activePatients: "সক্ৰিয় ৰোগী", improving: "উন্নতি হৈ আছে", stable: "স্থিৰ", needsAttention: "মনোযোগ প্ৰয়োজন", trend: "ধাৰা", activity: "কাৰ্যকলাপ", authorization: "অনুমোদন", assigned: "আবণ্টিত", connectPatient: "ৰোগীৰ সৈতে সংযোগ কৰক", connectPatientDescription: "কেৱল চাব পৰা নিৰীক্ষণৰ অনুমতি বিচাৰিবলৈ ৰোগীৰ কোড লিখক।", requestPatientAuthorization: "ৰোগীৰ অনুমতি বিচাৰক", patientCodePlaceholder: "ৰোগীৰ কোড (যেনে MNR-P-ABC123)", sendRequest: "অনুৰোধ পঠাওক", progressMonitoring: "অগ্ৰগতি নিৰীক্ষণ", openProfile: "প্ৰ'ফাইল খোলক", noAssignedPatients: "বৰ্তমান আপোনাৰ বাবে কোনো ৰোগী আবণ্টিত নাই। ওপৰৰ ৰোগী কোড ব্যৱহাৰ কৰি অনুমতি বিচাৰক।", noActivityRecorded: "কোনো কাৰ্যকলাপ লিপিবদ্ধ হোৱা নাই", insufficientData: "পৰ্যাপ্ত তথ্য নাই", memoryActivity: "স্মৃতি", attentionActivity: "মনোযোগ", routineRecallActivity: "দিনচৰ্যা মনত পেলোৱা", patternRecognitionActivity: "আৰ্হি চিনাক্তকৰণ", objectRecognitionActivity: "বস্তু চিনাক্তকৰণ", familyFamiliarityActivity: "পৰিয়ালৰ চিনাকি", healthcareServerInvalidResponse: "স্বাস্থ্য সেৱকে বৈধ উত্তৰ দিয়া নাই। বেকএণ্ড আৰু VITE_API_URL পৰীক্ষা কৰক।", unableToLoadPatientInformation: "ৰোগীৰ তথ্য লোড কৰিব নোৱাৰিলে।", unableToSendRequest: "অনুৰোধ পঠাব নোৱাৰিলে।",
};
const healthcareBengali = {
  healthcareWorkerPortal: "স্বাস্থ্যকর্মী পোর্টাল", assignedPatients: "নির্ধারিত রোগী", authorizedPatientProgress: "অনুমোদিত রোগীদের অগ্রগতি, কার্যকলাপ ও জ্ঞানীয় প্রবণতা।", loadingAssignedPatients: "নির্ধারিত রোগী লোড হচ্ছে…", loadingAuthorizedPatientData: "অনুমোদিত রোগীর তথ্য লোড হচ্ছে…", backToAssignedPatients: "নির্ধারিত রোগী", readOnlyAccess: "শুধু দেখার অনুমতি", patientAuthorizedMonitoring: "রোগীর অনুমোদিত পর্যবেক্ষণ", activitySnapshot: "কার্যকলাপের সারাংশ", patientOverview: "রোগীর সারাংশ", last7Days: "গত ৭ দিন", completedActivities: "সম্পন্ন কার্যকলাপ", averageAccuracy: "গড় নির্ভুলতা", averageScore: "গড় স্কোর", sessionsThisWeek: "এই সপ্তাহের সেশন", cognitiveStatus: "জ্ঞানীয় অবস্থা", currentTrend: "বর্তমান প্রবণতা", risk: "ঝুঁকি", sessionsReviewed: "সেশন পর্যালোচনা করা হয়েছে", clinicalGuidance: "চিকিৎসাগত নির্দেশনা", alertsNextStep: "সতর্কতা ও পরবর্তী পদক্ষেপ", noPerformanceAlert: "কর্মদক্ষতার কোনো সতর্কতা নেই", noSignificantPerformanceAlert: "সাম্প্রতিক কার্যকলাপে কর্মদক্ষতার কোনো উল্লেখযোগ্য সতর্কতা নেই।", recommendedFocus: "প্রস্তাবিত মনোযোগ", wellbeing: "সুস্থতা", recentMoodCheckIns: "সাম্প্রতিক মেজাজ পরীক্ষা", noMoodCheckIns: "কোনো মেজাজ পরীক্ষা নথিভুক্ত নেই।", activityHistory: "কার্যকলাপের ইতিহাস", recentCompletedSessions: "সাম্প্রতিক সম্পন্ন সেশন", total: "মোট", noCompletedActivities: "এখনও কোনো জ্ঞানীয় কার্যকলাপ সম্পন্ন হয়নি।", overallPatientProgress: "রোগীর সামগ্রিক অগ্রগতি", onlyAuthorizedPatients: "শুধু আপনার জন্য অনুমোদিত রোগীদের অন্তর্ভুক্ত করা হয়েছে।", activities: "কার্যকলাপ", activePatients: "সক্রিয় রোগী", improving: "উন্নতি হচ্ছে", stable: "স্থিতিশীল", needsAttention: "মনোযোগ প্রয়োজন", trend: "প্রবণতা", activity: "কার্যকলাপ", authorization: "অনুমোদন", assigned: "নির্ধারিত", connectPatient: "রোগীকে যুক্ত করুন", connectPatientDescription: "শুধু দেখার পর্যবেক্ষণের অনুমতি চাইতে রোগীর কোড লিখুন।", requestPatientAuthorization: "রোগীর অনুমতি চান", patientCodePlaceholder: "রোগী কোড (যেমন MNR-P-ABC123)", sendRequest: "অনুরোধ পাঠান", progressMonitoring: "অগ্রগতি পর্যবেক্ষণ", openProfile: "প্রোফাইল খুলুন", noAssignedPatients: "এখনও আপনার জন্য কোনো রোগী নির্ধারিত নেই। উপরের রোগী কোড দিয়ে অনুমতি চান।", noActivityRecorded: "কোনো কার্যকলাপ নথিভুক্ত নেই", insufficientData: "পর্যাপ্ত তথ্য নেই", memoryActivity: "স্মৃতি", attentionActivity: "মনোযোগ", routineRecallActivity: "দিনচর্যা মনে করা", patternRecognitionActivity: "ধরন শনাক্তকরণ", objectRecognitionActivity: "বস্তু শনাক্তকরণ", familyFamiliarityActivity: "পারিবারিক পরিচিতি", healthcareServerInvalidResponse: "স্বাস্থ্য সার্ভার বৈধ উত্তর দেয়নি। ব্যাকএন্ড ও VITE_API_URL পরীক্ষা করুন।", unableToLoadPatientInformation: "রোগীর তথ্য লোড করা যায়নি।", unableToSendRequest: "অনুরোধ পাঠানো যায়নি।",
};
const healthcareNagamese = {
  healthcareWorkerPortal: "Healthcare worker portal", assignedPatients: "Assigned patient khan", authorizedPatientProgress: "Authorized patient progress, activity aru monor trend.", loadingAssignedPatients: "Assigned patient khan load hoi ase…", loadingAuthorizedPatientData: "Authorized patient data load hoi ase…", backToAssignedPatients: "Assigned patient khan", readOnlyAccess: "Kebal sabo para access", patientAuthorizedMonitoring: "Patient approved monitoring", activitySnapshot: "Activity snapshot", patientOverview: "Patientor overview", last7Days: "Jua 7 din", completedActivities: "Pura activities", averageAccuracy: "Average thik thaka", averageScore: "Gor score", sessionsThisWeek: "Ei hapta sessions", cognitiveStatus: "Monor obostha", currentTrend: "Etiyar trend", risk: "Jokhim", sessionsReviewed: "sessions sai loise", clinicalGuidance: "Clinical guidance", alertsNextStep: "Alert aru next step", noPerformanceAlert: "Performance alert nai", noSignificantPerformanceAlert: "Olop dinor activity te kunu dangor performance alert nai.", recommendedFocus: "Suggested focus", wellbeing: "Bhal thaka", recentMoodCheckIns: "Olop dinor mood check-in", noMoodCheckIns: "Kunu mood check-in record nai.", activityHistory: "Activity history", recentCompletedSessions: "Olop dinor pura sessions", total: "Muth", noCompletedActivities: "Etiya kunu monor activity pura hua nai.", overallPatientProgress: "Patient overall progress", onlyAuthorizedPatients: "Kebal apunak authorized patient khan include hoise.", activities: "Kaam khan", activePatients: "Active patient khan", improving: "Bhal hoi ase", stable: "Ekedore ase", needsAttention: "Mon dibo lage", trend: "Cholti dhara", activity: "Kaam", authorization: "Onumoti", assigned: "Dibo hoise", connectPatient: "Patient connect koribo", connectPatientDescription: "Kebal sabo monitoring permission lobole patient code dibo.", requestPatientAuthorization: "Patient permission mangibo", patientCodePlaceholder: "Patient code (jeneka MNR-P-ABC123)", sendRequest: "Request pathabo", progressMonitoring: "Progress sai thakibo", openProfile: "Profile khulibo", noAssignedPatients: "Etiya apunak kunu patient assign kora nai. Uporor patient code loi permission mangibo.", noActivityRecorded: "Kunu activity record nai", insufficientData: "Jothesto data nai", memoryActivity: "Monot rakha", attentionActivity: "Mon dibo", routineRecallActivity: "Rozor kotha monot kora", patternRecognitionActivity: "Pattern chinibo", objectRecognitionActivity: "Bostu chinibo", familyFamiliarityActivity: "Poriyar chinaki", healthcareServerInvalidResponse: "Healthcare server pora thik response ahibo nai. Backend aru VITE_API_URL check koribo.", unableToLoadPatientInformation: "Patient information load hobo nai.", unableToSendRequest: "Request pathabo nai.",
};
const healthcareWorkerRequestsEnglish = {
  healthcareRequestsUnavailable: "Healthcare requests are unavailable because the backend has not been restarted with the latest routes.",
  unableToLoadHealthcareRequests: "Unable to load healthcare worker requests", couldNotUpdateRequest: "Could not update request",
  healthcareWorkerAccessRequests: "Healthcare worker access requests", healthcareWorkerRequest: "Healthcare Worker Request",
  healthcareWorkerRequests: "Healthcare Worker Requests", approveProgressAccess: "Approve access to your progress?",
  healthcareWorker: "Healthcare worker", verifiedHealthcareWorker: "Verified healthcare worker",
  readOnlyProgressAccess: "would like read-only access to your cognitive progress and activity data.",
  approveAccess: "Approve access", healthcareAccessPrivacy: "You control healthcare-worker access. Approval grants read-only progress monitoring.",
};
const healthcareWorkerRequestsHindi = {
  healthcareRequestsUnavailable: "स्वास्थ्यकर्मी अनुरोध उपलब्ध नहीं हैं क्योंकि बैकएंड नवीनतम मार्गों के साथ पुनः शुरू नहीं हुआ है।",
  unableToLoadHealthcareRequests: "स्वास्थ्यकर्मी अनुरोध लोड नहीं हो सके", couldNotUpdateRequest: "अनुरोध बदला नहीं जा सका",
  healthcareWorkerAccessRequests: "स्वास्थ्यकर्मी पहुँच अनुरोध", healthcareWorkerRequest: "स्वास्थ्यकर्मी अनुरोध",
  healthcareWorkerRequests: "स्वास्थ्यकर्मी अनुरोध", approveProgressAccess: "अपनी प्रगति देखने की अनुमति दें?",
  healthcareWorker: "स्वास्थ्यकर्मी", verifiedHealthcareWorker: "सत्यापित स्वास्थ्यकर्मी",
  readOnlyProgressAccess: "आपकी संज्ञानात्मक प्रगति और गतिविधि जानकारी को केवल देखने की अनुमति चाहता है।",
  approveAccess: "पहुँच की अनुमति दें", healthcareAccessPrivacy: "स्वास्थ्यकर्मी की पहुँच आपके नियंत्रण में है। अनुमति देने से केवल प्रगति की निगरानी मिलती है।",
};
const healthcareWorkerRequestsTelugu = {
  healthcareRequestsUnavailable: "ఆరోగ్య కార్యకర్త అభ్యర్థనలు అందుబాటులో లేవు; బ్యాకెండ్ తాజా మార్గాలతో పునఃప్రారంభించబడలేదు.",
  unableToLoadHealthcareRequests: "ఆరోగ్య కార్యకర్త అభ్యర్థనలు లోడ్ కాలేదు", couldNotUpdateRequest: "అభ్యర్థన నవీకరించబడలేదు",
  healthcareWorkerAccessRequests: "ఆరోగ్య కార్యకర్త యాక్సెస్ అభ్యర్థనలు", healthcareWorkerRequest: "ఆరోగ్య కార్యకర్త అభ్యర్థన",
  healthcareWorkerRequests: "ఆరోగ్య కార్యకర్త అభ్యర్థనలు", approveProgressAccess: "మీ పురోగతిని చూడటానికి అనుమతించాలా?",
  healthcareWorker: "ఆరోగ్య కార్యకర్త", verifiedHealthcareWorker: "ధృవీకరించిన ఆరోగ్య కార్యకర్త",
  readOnlyProgressAccess: "మీ జ్ఞాన పురోగతి మరియు కార్యకలాప సమాచారాన్ని చూడడానికి మాత్రమే అనుమతి కోరుతున్నారు.",
  approveAccess: "యాక్సెస్ అనుమతించండి", healthcareAccessPrivacy: "ఆరోగ్య కార్యకర్త యాక్సెస్ మీ నియంత్రణలో ఉంటుంది. అనుమతి ఇస్తే పురోగతిని చూడడానికి మాత్రమే వీలవుతుంది.",
};
const healthcareWorkerRequestsAssamese = {
  healthcareRequestsUnavailable: "স্বাস্থ্যকৰ্মীৰ অনুৰোধ উপলব্ধ নহয়, কাৰণ বেকএণ্ড শেহতীয়া পথসমূহৰ সৈতে পুনৰ আৰম্ভ হোৱা নাই।",
  unableToLoadHealthcareRequests: "স্বাস্থ্যকৰ্মীৰ অনুৰোধ লোড কৰিব নোৱাৰিলে", couldNotUpdateRequest: "অনুৰোধ সংশোধন কৰিব নোৱাৰিলে",
  healthcareWorkerAccessRequests: "স্বাস্থ্যকৰ্মীৰ প্ৰৱেশ অনুৰোধ", healthcareWorkerRequest: "স্বাস্থ্যকৰ্মীৰ অনুৰোধ",
  healthcareWorkerRequests: "স্বাস্থ্যকৰ্মীৰ অনুৰোধসমূহ", approveProgressAccess: "আপোনাৰ অগ্ৰগতি চাবলৈ অনুমতি দিব নে?",
  healthcareWorker: "স্বাস্থ্যকৰ্মী", verifiedHealthcareWorker: "যাচাইকৃত স্বাস্থ্যকৰ্মী",
  readOnlyProgressAccess: "আপোনাৰ জ্ঞানীয় অগ্ৰগতি আৰু কাৰ্যকলাপৰ তথ্য কেৱল চাব পৰা সুবিধা বিচাৰে।",
  approveAccess: "প্ৰৱেশ অনুমোদন কৰক", healthcareAccessPrivacy: "স্বাস্থ্যকৰ্মীৰ প্ৰৱেশ আপোনাৰ নিয়ন্ত্ৰণত থাকে। অনুমোদনে কেৱল অগ্ৰগতি নিৰীক্ষণৰ সুবিধা দিয়ে।",
};
const healthcareWorkerRequestsBengali = {
  healthcareRequestsUnavailable: "স্বাস্থ্যকর্মীর অনুরোধ উপলব্ধ নেই, কারণ ব্যাকএন্ড সর্বশেষ রুটসহ পুনরায় চালু হয়নি।",
  unableToLoadHealthcareRequests: "স্বাস্থ্যকর্মীর অনুরোধ লোড করা যায়নি", couldNotUpdateRequest: "অনুরোধ হালনাগাদ করা যায়নি",
  healthcareWorkerAccessRequests: "স্বাস্থ্যকর্মীর প্রবেশ অনুরোধ", healthcareWorkerRequest: "স্বাস্থ্যকর্মীর অনুরোধ",
  healthcareWorkerRequests: "স্বাস্থ্যকর্মীর অনুরোধগুলি", approveProgressAccess: "আপনার অগ্রগতি দেখার অনুমতি দেবেন?",
  healthcareWorker: "স্বাস্থ্যকর্মী", verifiedHealthcareWorker: "যাচাইকৃত স্বাস্থ্যকর্মী",
  readOnlyProgressAccess: "আপনার জ্ঞানীয় অগ্রগতি ও কার্যকলাপের তথ্য শুধু দেখার অনুমতি চান।",
  approveAccess: "প্রবেশ অনুমোদন করুন", healthcareAccessPrivacy: "স্বাস্থ্যকর্মীর প্রবেশ আপনার নিয়ন্ত্রণে থাকে। অনুমোদন দিলে শুধু অগ্রগতি পর্যবেক্ষণ করা যাবে।",
};
const healthcareWorkerRequestsNagamese = {
  healthcareRequestsUnavailable: "Sastho worker request available nai, backend latest route loi restart hua nai.",
  unableToLoadHealthcareRequests: "Sastho worker request khan load hobo nai", couldNotUpdateRequest: "Request update hobo nai",
  healthcareWorkerAccessRequests: "Sastho worker access request khan", healthcareWorkerRequest: "Sastho worker request",
  healthcareWorkerRequests: "Sastho worker request khan", approveProgressAccess: "Apunar progress sabole permission dibo niki?",
  healthcareWorker: "Sastho worker", verifiedHealthcareWorker: "Verified sastho worker",
  readOnlyProgressAccess: "Apunar monor progress aru activity data kebal sabole permission bisare.",
  approveAccess: "Access approval dibo", healthcareAccessPrivacy: "Sastho worker access apunar control te ase. Approval dile kebal progress monitoring hobo.",
};
const caregiverDashboardEnglish = {
  caregiverDashboard: "Caregiver Dashboard", patientOverview: "Patient Overview", carePlan: "Care Plan", dailyCarePlan: "Today's Care Plan", pendingActions: "Pending Actions", actionHistory: "Action History", currentStatus: "Current status", markCompleted: "Mark Completed", dismiss: "Dismiss", overallProgress: "Overall Progress", recentSessions: "Recent Sessions", cognitiveHealthTrend: "Cognitive Health Trend", smartAlerts: "Smart Alerts", dailyCareRoutine: "Daily Care Routine", latestMood: "Latest Mood", reason: "Reason", loadingPatientProgress: "Loading patient progress…", overviewIntro: "Monitor cognitive health and daily progress at a glance.", progressRange: "Progress range", recentActivity: "Recent activity", patientCode: "Patient Code", overallStatus: "Overall status", predictiveCognitiveAnalytics: "Predictive Cognitive Analytics", analyticsNote: "Performance trend from activity history. It is not a medical diagnosis.", insufficientData: "Insufficient data", overallTrend: "Overall trend", riskLevel: "Risk level", confidence: "Confidence", dataAvailable: "Data available", gamesCompleted: "Games Completed", totalSessions: "Total sessions", adherence: "Adherence", reminderCompletion: "Reminder completion", cognitivePerformance: "Cognitive Performance", performanceOverview: "Performance Overview", currentPerformance: "Current performance across cognitive activities.", cognitiveTrend: "Cognitive Trend", recentAccuracy: "Recent accuracy across completed activities.", aiRecommendation: "AI Recommendation", try: "Try", recommendedLevel: "Recommended Level", noMoodCheckIn: "No mood check-in recorded yet.", caregiverInsights: "Caregiver Insights", alertsHelp: "Only items that may require your attention.", reminderAdherence: "Reminder Adherence", routineHelp: "How consistently the patient completes scheduled reminders.", missed: "Missed", reminderHistory: "Reminder History", recentReminders: "Recent Reminders", activityHelp: "Latest completed cognitive activities.", noProgress: "No progress data available yet.", noHistory: "No activity history available yet.", viewAllSessions: "View All Sessions", priority: "Priority", acrossActivities: "Across activities", attention: "Attention", dashboard: "Dashboard", family: "Family", history: "History", insights: "Insights", memory: "Memory", mood: "Mood", noMood: "No mood check recorded", noReminderHistory: "No reminder history available yet.", objectRecognition: "Object Recognition", objects: "Objects", overview: "Overview", pattern: "Pattern", patternRecognition: "Pattern Recognition", pending: "Pending", predictive: "Predictive", progress: "Progress", recommendation: "Recommendation", reminderListHelp: "A short list of recent reminder activity.", routine: "Routine", routineRecall: "Daily Routine Recall", showAll: "Show All", showLess: "Show Less", total: "Total",
};
const caregiverDashboardHindi = {
  caregiverDashboard: "देखभालकर्ता डैशबोर्ड", patientOverview: "रोगी का सारांश", carePlan: "देखभाल योजना", dailyCarePlan: "आज की देखभाल योजना", pendingActions: "लंबित कार्य", actionHistory: "कार्य इतिहास", currentStatus: "वर्तमान स्थिति", markCompleted: "पूरा करें", dismiss: "हटाएँ", overallProgress: "कुल प्रगति", recentSessions: "हाल के सत्र", cognitiveHealthTrend: "संज्ञानात्मक स्वास्थ्य रुझान", smartAlerts: "स्मार्ट चेतावनियाँ", dailyCareRoutine: "दैनिक देखभाल दिनचर्या", latestMood: "नवीनतम मनोदशा", reason: "कारण", loadingPatientProgress: "रोगी की प्रगति लोड हो रही है…", overviewIntro: "संज्ञानात्मक स्वास्थ्य और दैनिक प्रगति एक नज़र में देखें।", progressRange: "प्रगति सीमा", recentActivity: "हाल की गतिविधि", patientCode: "रोगी कोड", overallStatus: "कुल स्थिति", predictiveCognitiveAnalytics: "पूर्वानुमानित संज्ञानात्मक विश्लेषण", analyticsNote: "गतिविधि इतिहास से प्रदर्शन रुझान। यह चिकित्सकीय निदान नहीं है।", insufficientData: "पर्याप्त जानकारी नहीं", overallTrend: "कुल रुझान", riskLevel: "जोखिम स्तर", confidence: "विश्वास", dataAvailable: "उपलब्ध जानकारी", gamesCompleted: "पूरे खेल", totalSessions: "कुल सत्र", adherence: "पालन", reminderCompletion: "रिमाइंडर पूरा करना", cognitivePerformance: "संज्ञानात्मक प्रदर्शन", performanceOverview: "प्रदर्शन सारांश", currentPerformance: "संज्ञानात्मक गतिविधियों में वर्तमान प्रदर्शन।", cognitiveTrend: "संज्ञानात्मक रुझान", recentAccuracy: "पूरी की गई गतिविधियों में हाल की सटीकता।", aiRecommendation: "AI सुझाव", try: "करें", recommendedLevel: "सुझाया गया स्तर", noMoodCheckIn: "अभी कोई मनोदशा जाँच दर्ज नहीं है।", caregiverInsights: "देखभालकर्ता जानकारी", alertsHelp: "केवल वे बातें जिन्हें आपके ध्यान की आवश्यकता हो सकती है।", reminderAdherence: "रिमाइंडर पालन", routineHelp: "रोगी तय रिमाइंडर कितनी नियमितता से पूरा करता है।", missed: "छूटा", reminderHistory: "रिमाइंडर इतिहास", recentReminders: "हाल के रिमाइंडर", activityHelp: "हाल की पूरी की गई संज्ञानात्मक गतिविधियाँ।", noProgress: "अभी प्रगति की जानकारी उपलब्ध नहीं है।", noHistory: "अभी गतिविधि इतिहास उपलब्ध नहीं है।", viewAllSessions: "सभी सत्र देखें", priority: "प्राथमिकता", acrossActivities: "सभी गतिविधियों में", attention: "ध्यान", dashboard: "डैशबोर्ड", family: "परिवार", history: "इतिहास", insights: "जानकारी", memory: "स्मृति", mood: "मनोदशा", noMood: "कोई मनोदशा जाँच दर्ज नहीं है", noReminderHistory: "अभी रिमाइंडर इतिहास उपलब्ध नहीं है।", objectRecognition: "वस्तु पहचान", objects: "वस्तुएँ", overview: "सारांश", pattern: "पैटर्न", patternRecognition: "पैटर्न पहचान", pending: "लंबित", predictive: "पूर्वानुमान", progress: "प्रगति", recommendation: "सुझाव", reminderListHelp: "हाल की रिमाइंडर गतिविधि की छोटी सूची।", routine: "दिनचर्या", routineRecall: "दैनिक दिनचर्या स्मरण", showAll: "सभी दिखाएँ", showLess: "कम दिखाएँ", total: "कुल",
};
const caregiverDashboardTelugu = {
  caregiverDashboard: "సంరక్షకుల డ్యాష్‌బోర్డ్", patientOverview: "రోగి సమీక్ష", carePlan: "సంరక్షణ ప్రణాళిక", dailyCarePlan: "నేటి సంరక్షణ ప్రణాళిక", pendingActions: "పెండింగ్ చర్యలు", actionHistory: "చర్యల చరిత్ర", currentStatus: "ప్రస్తుత స్థితి", markCompleted: "పూర్తయినట్లు గుర్తించండి", dismiss: "తొలగించండి", overallProgress: "మొత్తం పురోగతి", recentSessions: "ఇటీవలి సెషన్‌లు", cognitiveHealthTrend: "జ్ఞాన ఆరోగ్య ధోరణి", smartAlerts: "స్మార్ట్ హెచ్చరికలు", dailyCareRoutine: "రోజువారీ సంరక్షణ దినచర్య", latestMood: "తాజా మానసిక స్థితి", reason: "కారణం", loadingPatientProgress: "రోగి పురోగతిని లోడ్ చేస్తోంది…", overviewIntro: "జ్ఞాన ఆరోగ్యాన్ని మరియు రోజువారీ పురోగతిని ఒక చూపులో చూడండి.", progressRange: "పురోగతి పరిధి", recentActivity: "ఇటీవలి కార్యకలాపం", patientCode: "రోగి కోడ్", overallStatus: "మొత్తం స్థితి", predictiveCognitiveAnalytics: "అంచనా జ్ఞాన విశ్లేషణ", analyticsNote: "కార్యకలాపాల చరిత్రలోని పనితీరు ధోరణి. ఇది వైద్య నిర్ధారణ కాదు.", insufficientData: "తగిన సమాచారం లేదు", overallTrend: "మొత్తం ధోరణి", riskLevel: "ప్రమాద స్థాయి", confidence: "విశ్వసనీయత", dataAvailable: "అందుబాటులో ఉన్న సమాచారం", gamesCompleted: "పూర్తయిన ఆటలు", totalSessions: "మొత్తం సెషన్‌లు", adherence: "పాటింపు", reminderCompletion: "గుర్తుచూపు పూర్తి చేయడం", cognitivePerformance: "జ్ఞాన పనితీరు", performanceOverview: "పనితీరు సమీక్ష", currentPerformance: "జ్ఞాన కార్యకలాపాల్లో ప్రస్తుత పనితీరు.", cognitiveTrend: "జ్ఞాన ధోరణి", recentAccuracy: "పూర్తయిన కార్యకలాపాల్లో ఇటీవలి ఖచ్చితత్వం.", aiRecommendation: "AI సూచన", try: "ప్రయత్నించండి", recommendedLevel: "సూచించిన స్థాయి", noMoodCheckIn: "ఇంకా మానసిక స్థితి నమోదు లేదు.", caregiverInsights: "సంరక్షకుల అవగాహనలు", alertsHelp: "మీ దృష్టి అవసరమైన అంశాలనే చూపిస్తుంది.", reminderAdherence: "గుర్తుచూపు పాటింపు", routineHelp: "రోగి నిర్ణయించిన గుర్తుచూపులను ఎంత క్రమంగా పూర్తి చేస్తున్నారో చూపిస్తుంది.", missed: "మిస్ అయినవి", reminderHistory: "గుర్తుచూపు చరిత్ర", recentReminders: "ఇటీవలి గుర్తుచూపులు", activityHelp: "ఇటీవల పూర్తి చేసిన జ్ఞాన కార్యకలాపాలు.", noProgress: "ఇంకా పురోగతి సమాచారం అందుబాటులో లేదు.", noHistory: "ఇంకా కార్యకలాపాల చరిత్ర అందుబాటులో లేదు.", viewAllSessions: "అన్ని సెషన్‌లను చూడండి", priority: "ప్రాధాన్యత", acrossActivities: "అన్ని కార్యకలాపాల్లో",
};
const caregiverDashboardAssamese = {
  caregiverDashboard: "যত্নদাতা ডেশ্বব'ৰ্ড", patientOverview: "ৰোগীৰ সাৰাংশ", carePlan: "যত্ন পৰিকল্পনা", dailyCarePlan: "আজিৰ যত্ন পৰিকল্পনা", pendingActions: "বাকী থকা কাম", actionHistory: "কামৰ ইতিহাস", currentStatus: "বৰ্তমান অৱস্থা", markCompleted: "সম্পূৰ্ণ বুলি চিহ্নিত কৰক", dismiss: "আঁতৰাওক", overallProgress: "সামগ্ৰিক অগ্ৰগতি", recentSessions: "শেহতীয়া সত্র", cognitiveHealthTrend: "জ্ঞানীয় স্বাস্থ্যৰ ধাৰা", smartAlerts: "স্মাৰ্ট সতৰ্কবাণী", dailyCareRoutine: "দৈনিক যত্নৰ দিনচৰ্যা", latestMood: "শেহতীয়া মেজাজ", reason: "কাৰণ", loadingPatientProgress: "ৰোগীৰ অগ্ৰগতি লোড হৈ আছে…", overviewIntro: "জ্ঞানীয় স্বাস্থ্য আৰু দৈনিক অগ্ৰগতি একে নজৰত চাওক।", progressRange: "অগ্ৰগতিৰ পৰিসৰ", recentActivity: "শেহতীয়া কাৰ্যকলাপ", patientCode: "ৰোগী ক'ড", overallStatus: "সামগ্ৰিক অৱস্থা", predictiveCognitiveAnalytics: "পূৰ্বানুমানভিত্তিক জ্ঞানীয় বিশ্লেষণ", analyticsNote: "কাৰ্যকলাপৰ ইতিহাসৰ পৰা প্ৰদৰ্শনৰ ধাৰা। ই চিকিৎসাজনিত নিৰ্ণয় নহয়।", insufficientData: "পৰ্যাপ্ত তথ্য নাই", overallTrend: "সামগ্ৰিক ধাৰা", riskLevel: "বিপদৰ স্তৰ", confidence: "বিশ্বাসযোগ্যতা", dataAvailable: "উপলব্ধ তথ্য", gamesCompleted: "সম্পূৰ্ণ হোৱা খেল", totalSessions: "মুঠ সত্র", adherence: "নিয়ম মানি চলা", reminderCompletion: "সোঁৱৰণী সম্পূৰ্ণ কৰা", cognitivePerformance: "জ্ঞানীয় প্ৰদৰ্শন", performanceOverview: "প্ৰদৰ্শনৰ সাৰাংশ", currentPerformance: "জ্ঞানীয় কাৰ্যকলাপসমূহত বৰ্তমানৰ প্ৰদৰ্শন।", cognitiveTrend: "জ্ঞানীয় ধাৰা", recentAccuracy: "সম্পূৰ্ণ কৰা কাৰ্যকলাপসমূহৰ শেহতীয়া শুদ্ধতা।", aiRecommendation: "AI পৰামৰ্শ", try: "চেষ্টা কৰক", recommendedLevel: "পৰামৰ্শ দিয়া স্তৰ", noMoodCheckIn: "এতিয়ালৈ কোনো মেজাজ পৰীক্ষা লিপিবদ্ধ হোৱা নাই।", caregiverInsights: "যত্নদাতাৰ অন্তৰ্দৃষ্টি", alertsHelp: "কেৱল আপোনাৰ মনোযোগৰ প্ৰয়োজন হ'ব পৰা বিষয়সমূহ।", reminderAdherence: "সোঁৱৰণী মানি চলা", routineHelp: "ৰোগীয়ে নিৰ্ধাৰিত সোঁৱৰণীসমূহ কিমান নিয়মিতভাৱে সম্পূৰ্ণ কৰে।", missed: "বাদ পৰিল", reminderHistory: "সোঁৱৰণীৰ ইতিহাস", recentReminders: "শেহতীয়া সোঁৱৰণী", activityHelp: "শেহতীয়াকৈ সম্পূৰ্ণ হোৱা জ্ঞানীয় কাৰ্যকলাপসমূহ।", noProgress: "এতিয়াও অগ্ৰগতিৰ তথ্য উপলব্ধ নাই।", noHistory: "এতিয়াও কাৰ্যকলাপৰ ইতিহাস উপলব্ধ নাই।", viewAllSessions: "সকলো সত্র চাওক", priority: "অগ্ৰাধিকাৰ", acrossActivities: "সকলো কাৰ্যকলাপত",
};
const caregiverDashboardBengali = {
  caregiverDashboard: "যত্নদাতা ড্যাশবোর্ড", patientOverview: "রোগীর সারসংক্ষেপ", carePlan: "যত্ন পরিকল্পনা", dailyCarePlan: "আজকের যত্ন পরিকল্পনা", pendingActions: "বাকি কাজ", actionHistory: "কাজের ইতিহাস", currentStatus: "বর্তমান অবস্থা", markCompleted: "সম্পূর্ণ হিসেবে চিহ্নিত করুন", dismiss: "সরান", overallProgress: "সামগ্রিক অগ্রগতি", recentSessions: "সাম্প্রতিক সেশন", cognitiveHealthTrend: "জ্ঞানীয় স্বাস্থ্যের ধারা", smartAlerts: "স্মার্ট সতর্কতা", dailyCareRoutine: "দৈনন্দিন যত্নের রুটিন", latestMood: "সর্বশেষ মনের অবস্থা", reason: "কারণ", loadingPatientProgress: "রোগীর অগ্রগতি লোড হচ্ছে…", overviewIntro: "জ্ঞানীয় স্বাস্থ্য ও দৈনন্দিন অগ্রগতি এক নজরে দেখুন।", progressRange: "অগ্রগতির পরিসর", recentActivity: "সাম্প্রতিক কার্যকলাপ", patientCode: "রোগী কোড", overallStatus: "সামগ্রিক অবস্থা", predictiveCognitiveAnalytics: "পূর্বাভাসভিত্তিক জ্ঞানীয় বিশ্লেষণ", analyticsNote: "কার্যকলাপের ইতিহাস থেকে কর্মদক্ষতার ধারা। এটি চিকিৎসাগত নির্ণয় নয়।", insufficientData: "পর্যাপ্ত তথ্য নেই", overallTrend: "সামগ্রিক ধারা", riskLevel: "ঝুঁকির স্তর", confidence: "বিশ্বাসযোগ্যতা", dataAvailable: "উপলব্ধ তথ্য", gamesCompleted: "সম্পূর্ণ করা খেলা", totalSessions: "মোট সেশন", adherence: "নিয়ম মেনে চলা", reminderCompletion: "স্মরণিকা সম্পূর্ণ করা", cognitivePerformance: "জ্ঞানীয় কর্মদক্ষতা", performanceOverview: "কর্মদক্ষতার সারসংক্ষেপ", currentPerformance: "জ্ঞানীয় কার্যকলাপগুলিতে বর্তমান কর্মদক্ষতা।", cognitiveTrend: "জ্ঞানীয় ধারা", recentAccuracy: "সম্পূর্ণ করা কার্যকলাপগুলির সাম্প্রতিক নির্ভুলতা।", aiRecommendation: "AI পরামর্শ", try: "চেষ্টা করুন", recommendedLevel: "প্রস্তাবিত স্তর", noMoodCheckIn: "এখনও কোনো মনের অবস্থা পরীক্ষা নথিভুক্ত হয়নি।", caregiverInsights: "যত্নদাতার অন্তর্দৃষ্টি", alertsHelp: "শুধু সেই বিষয়গুলি যেগুলিতে আপনার মনোযোগ লাগতে পারে।", reminderAdherence: "স্মরণিকা মেনে চলা", routineHelp: "রোগী নির্ধারিত স্মরণিকাগুলি কত নিয়মিতভাবে সম্পূর্ণ করেন।", missed: "ছুটে গেছে", reminderHistory: "স্মরণিকার ইতিহাস", recentReminders: "সাম্প্রতিক স্মরণিকা", activityHelp: "সাম্প্রতিক সম্পূর্ণ করা জ্ঞানীয় কার্যকলাপ।", noProgress: "এখনও অগ্রগতির তথ্য উপলব্ধ নেই।", noHistory: "এখনও কার্যকলাপের ইতিহাস উপলব্ধ নেই।", viewAllSessions: "সব সেশন দেখুন", priority: "অগ্রাধিকার", acrossActivities: "সব কার্যকলাপে",
};
const caregiverDashboardNagamese = {
  caregiverDashboard: "Caregiver dashboard", patientOverview: "Patientor chutu overview", carePlan: "Care plan", dailyCarePlan: "Aji care plan", pendingActions: "Baki thaka kaam", actionHistory: "Kaamor itihas", currentStatus: "Ekhon obostha", markCompleted: "Pura hoishe buli chinhit koribo", dismiss: "Hatai dibo", overallProgress: "Mot progress", recentSessions: "Notun session khan", cognitiveHealthTrend: "Monor healthor dhara", smartAlerts: "Smart alert khan", dailyCareRoutine: "Dinik care routine", latestMood: "Ses monor obostha", reason: "Karon", loadingPatientProgress: "Patientor progress load hoi ase…", overviewIntro: "Monor health aru dinor progress ek nazor te sabi.", progressRange: "Progressor range", recentActivity: "Notun activity", patientCode: "Patient code", overallStatus: "Mot obostha", predictiveCognitiveAnalytics: "Agor monor obostha analysis", analyticsNote: "Activity itihas pora performanceor dhara. Eitu medical diagnosis nohoi.", insufficientData: "Besi data nai", overallTrend: "Mot dhara", riskLevel: "Khatraor level", confidence: "Biswas joggo", dataAvailable: "Thaka data", gamesCompleted: "Pura kora game khan", totalSessions: "Mot session", adherence: "Niyom mani chola", reminderCompletion: "Monot korai diya pura kora", cognitivePerformance: "Monor performance", performanceOverview: "Performanceor overview", currentPerformance: "Cognitive activity khan te etiyar performance.", cognitiveTrend: "Monor dhara", recentAccuracy: "Pura kora activity khanor notun thik thaka.", aiRecommendation: "AI poramorsho", try: "Try koribo", recommendedLevel: "Poramorsho diya level", noMoodCheckIn: "Etiya loi monor obostha check record hoi nai.", caregiverInsights: "Caregiveror buja", alertsHelp: "Apunar dhyan lage eneka bostu khan matro.", reminderAdherence: "Monot korai diya mani chola", routineHelp: "Patient e thik kora monot korai diya khan kiman niyom hoi pura kore.", missed: "Miss hoishe", reminderHistory: "Monot korai diya itihas", recentReminders: "Notun monot korai diya khan", activityHelp: "Notun pura kora monor activity khan.", noProgress: "Etiya progress data nai.", noHistory: "Etiya activity itihas nai.", viewAllSessions: "Sob session dekha", priority: "Agor dorkar", acrossActivities: "Sob activity te",
};
const caregiverDashboardAdditionalTelugu = {
  attention: "శ్రద్ధ", dashboard: "డ్యాష్‌బోర్డ్", family: "కుటుంబం", history: "చరిత్ర", insights: "అవగాహనలు", memory: "జ్ఞాపకశక్తి", mood: "మానసిక స్థితి", noMood: "మానసిక స్థితి తనిఖీ నమోదు కాలేదు", noReminderHistory: "ఇంకా గుర్తుచూపు చరిత్ర అందుబాటులో లేదు.", objectRecognition: "వస్తు గుర్తింపు", objects: "వస్తువులు", overview: "సమీక్ష", pattern: "నమూనా", patternRecognition: "నమూనా గుర్తింపు", pending: "పెండింగ్", predictive: "అంచనా", progress: "పురోగతి", recommendation: "సూచన", reminderListHelp: "ఇటీవలి గుర్తుచూపు కార్యకలాపాల చిన్న జాబితా.", routine: "దినచర్య", routineRecall: "రోజువారీ దినచర్య గుర్తింపు", showAll: "అన్నీ చూపండి", showLess: "తక్కువ చూపండి", total: "మొత్తం",
};
const caregiverDashboardAdditionalAssamese = {
  attention: "মনোযোগ", dashboard: "ডেশ্বব'ৰ্ড", family: "পৰিয়াল", history: "ইতিহাস", insights: "অন্তৰ্দৃষ্টি", memory: "স্মৃতি", mood: "মেজাজ", noMood: "কোনো মেজাজ পৰীক্ষা লিপিবদ্ধ হোৱা নাই", noReminderHistory: "এতিয়াও সোঁৱৰণীৰ ইতিহাস উপলব্ধ নাই।", objectRecognition: "বস্তু চিনাক্তকৰণ", objects: "বস্তুসমূহ", overview: "সাৰাংশ", pattern: "নমুনা", patternRecognition: "নমুনা চিনাক্তকৰণ", pending: "বাকী", predictive: "পূৰ্বানুমান", progress: "অগ্ৰগতি", recommendation: "পৰামৰ্শ", reminderListHelp: "শেহতীয়া সোঁৱৰণী কাৰ্যকলাপৰ চমু তালিকা।", routine: "দিনচৰ্যা", routineRecall: "দৈনিক দিনচৰ্যা স্মৰণ", showAll: "সকলো দেখুৱাওক", showLess: "কম দেখুৱাওক", total: "মুঠ",
};
const caregiverDashboardAdditionalBengali = {
  attention: "মনোযোগ", dashboard: "ড্যাশবোর্ড", family: "পরিবার", history: "ইতিহাস", insights: "অন্তর্দৃষ্টি", memory: "স্মৃতি", mood: "মনের অবস্থা", noMood: "কোনো মনের অবস্থা পরীক্ষা নথিভুক্ত হয়নি", noReminderHistory: "এখনও স্মরণিকার ইতিহাস উপলব্ধ নেই।", objectRecognition: "বস্তু শনাক্তকরণ", objects: "বস্তুগুলি", overview: "সারসংক্ষেপ", pattern: "নকশা", patternRecognition: "নকশা শনাক্তকরণ", pending: "বাকি", predictive: "পূর্বাভাস", progress: "অগ্রগতি", recommendation: "পরামর্শ", reminderListHelp: "সাম্প্রতিক স্মরণিকা কার্যকলাপের সংক্ষিপ্ত তালিকা।", routine: "রুটিন", routineRecall: "দৈনন্দিন রুটিন স্মরণ", showAll: "সব দেখান", showLess: "কম দেখান", total: "মোট",
};
const caregiverDashboardAdditionalNagamese = {
  active: "Chalu ase", level: "Dhoron", score: "Pua number", attention: "Dhyan", dashboard: "Porichalona pata", family: "Ghoror manu", history: "Itihas", insights: "Bujibole paise", memory: "Monot thaka", mood: "Monor obostha", noMood: "Monor obostha check record nai", noReminderHistory: "Etiya monot korai diya itihas nai.", objectRecognition: "Bostu chinibo", objects: "Bostu khan", overview: "Chutu overview", pattern: "Namuna", patternRecognition: "Namuna chinibo", pending: "Baki ase", predictive: "Agor andaaz", progress: "Agor jua", recommendation: "Poramorsho", reminderListHelp: "Notun monot korai diya activityor chutu list.", routine: "Dinik routine", routineRecall: "Dinik routine monot anibo", showAll: "Sob dekha", showLess: "Kom dekha", total: "Mot",
};
const caregiverDashboardTemplatesEnglish = {
  insightNotEnoughData: "Not enough data to determine cognitive performance yet.", insightNoCompletedActivities: "Not enough completed activities to determine cognitive performance yet.", strongPerformance: "Strong Performance", needsSupport: "Needs Support", needsFocus: "Needs Focus", insightStrongMessage: "Performance is strong across the completed cognitive activities. Continue regular practice to maintain progress.", insightNeedsSupportMessage: "{activity} performance is currently {score}%. Additional practice and caregiver support may be helpful.", insightNeedsFocusMessage: "{activity} is currently the main area needing additional practice, while other completed activities are performing well.", insightNeedsAttentionMessage: "Some cognitive activities are below the expected range. {activity} is currently the lowest-performing area and should receive additional practice.", activityPerformanceNeedsAttention: "{activity} performance needs attention.", remindersMissed: "{count} reminder(s) missed.", overallStableMessage: "Recent cognitive performance and daily routine adherence are stable.", overallStableAction: "Continue regular cognitive activities and daily routines.", overallNeedsAttentionMessage: "Recent activity or routine adherence shows areas that need caregiver attention.", overallNeedsAttentionAction: "Review lower-performing activities and encourage the recommended cognitive activity.", overallMonitorMessage: "Some recent areas show room for improvement and should be monitored.", overallMonitorAction: "Encourage regular cognitive activities and follow up on missed reminders.", trendContinueMessage: "Continue activities to establish a clearer trend.", trendImprovingMessage: "Recent accuracy is improving compared with earlier sessions.", trendDecliningMessage: "Recent accuracy has declined compared with earlier sessions.", trendStableMessage: "Recent accuracy is relatively stable.", trendNotEnoughData: "Not enough recent data to determine a trend.", needsMonitoring: "Needs Monitoring", generallyImproving: "Generally Improving", generallyStable: "Generally Stable", trendMultipleDecline: "Multiple cognitive activities show a recent decline and should be monitored closely.", trendDecliningActivity: "{activity} shows a recent decline and should be monitored.", trendImprovingMultiple: "Recent cognitive performance is improving across multiple activities.", trendImprovingSome: "Recent performance is improving in some cognitive activities while other areas remain stable.", trendStableAvailable: "Recent cognitive performance is generally stable across the available activities.", performanceAlertTitle: "{activity} Performance Alert", monitoringAlertTitle: "{activity} Needs Monitoring", performanceSupportMessage: "{activity} performance is currently {score}%. Additional support may be needed.", performanceCurrentMessage: "{activity} performance is currently {score}%.", encourageRoutineRecall: "Encourage regular routine recall practice.", encouragePatternRecognition: "Encourage additional pattern recognition practice.", encourageObjectRecognition: "Encourage additional object recognition practice.", lowReminderAdherence: "Low Reminder Adherence", lowReminderMessage: "The patient has missed {count} reminder(s).", checkDailyRoutineAction: "Check whether the patient needs help following the daily routine.", droppingReminderAdherence: "Reminder Adherence Dropping", reminderAdherenceCurrent: "Reminder adherence is currently {rate}%.", followUpMissedReminders: "Follow up with the patient about missed reminders.", memoryAlert: "Memory Alert", attentionAlert: "Attention Alert", reviewMemoryAction: "Review recent memory activity and encourage regular practice.", reviewAttentionAction: "Review recent attention activity and encourage regular practice.", authenticationRequired: "Authentication required.", failedToLoadConnectedPatients: "Failed to load connected patients", noAcceptedConnectedPatients: "No accepted patients are connected to this caregiver.", failedToLoadDashboardAnalytics: "Failed to load dashboard analytics", unableToLoadPatientInformation: "Unable to load patient information.", unableToUpdateAction: "Unable to update action.", actionNotSaved: "The action was not saved with the requested status.", allRecommendedActionsHandled: "All recommended actions have been handled. Continue regular monitoring.", progressChartRange: "Progress chart range", sessionNumber: "Session {number}",
};
const caregiverDashboardTemplatesHindi = {
  allRecommendedActionsHandled: "सभी सुझाए गए कार्य पूरे कर लिए गए हैं। नियमित निगरानी जारी रखें।",
  insightNotEnoughData: "संज्ञानात्मक प्रदर्शन जानने के लिए अभी पर्याप्त जानकारी नहीं है।", insightNoCompletedActivities: "संज्ञानात्मक प्रदर्शन जानने के लिए अभी पर्याप्त पूर्ण गतिविधियाँ नहीं हैं।", strongPerformance: "मजबूत प्रदर्शन", needsSupport: "सहायता की आवश्यकता", needsFocus: "ध्यान की आवश्यकता", insightStrongMessage: "पूर्ण की गई संज्ञानात्मक गतिविधियों में प्रदर्शन अच्छा है। प्रगति बनाए रखने के लिए नियमित अभ्यास जारी रखें।", insightNeedsSupportMessage: "{activity} में प्रदर्शन अभी {score}% है। अतिरिक्त अभ्यास और देखभालकर्ता की सहायता उपयोगी हो सकती है।", insightNeedsFocusMessage: "{activity} को अभी अतिरिक्त अभ्यास की सबसे अधिक आवश्यकता है, जबकि अन्य पूर्ण गतिविधियों में प्रदर्शन अच्छा है।", insightNeedsAttentionMessage: "कुछ संज्ञानात्मक गतिविधियाँ अपेक्षित स्तर से नीचे हैं। {activity} में प्रदर्शन सबसे कम है और अतिरिक्त अभ्यास की आवश्यकता है।", activityPerformanceNeedsAttention: "{activity} के प्रदर्शन पर ध्यान देने की आवश्यकता है।", remindersMissed: "{count} रिमाइंडर छूटे हैं।", overallStableMessage: "हाल का संज्ञानात्मक प्रदर्शन और दैनिक दिनचर्या का पालन स्थिर है।", overallStableAction: "नियमित संज्ञानात्मक गतिविधियाँ और दैनिक दिनचर्या जारी रखें।", overallNeedsAttentionMessage: "हाल की गतिविधि या दिनचर्या के पालन में ऐसे क्षेत्र हैं जिन पर देखभालकर्ता का ध्यान चाहिए।", overallNeedsAttentionAction: "कम प्रदर्शन वाली गतिविधियों की समीक्षा करें और सुझाई गई संज्ञानात्मक गतिविधि के लिए प्रोत्साहित करें।", overallMonitorMessage: "हाल के कुछ क्षेत्रों में सुधार की गुंजाइश है और निगरानी की जानी चाहिए।", overallMonitorAction: "नियमित संज्ञानात्मक गतिविधियों के लिए प्रोत्साहित करें और छूटे रिमाइंडर पर बात करें।", trendContinueMessage: "स्पष्ट रुझान बनाने के लिए गतिविधियाँ जारी रखें।", trendImprovingMessage: "पहले के सत्रों की तुलना में हाल की सटीकता बेहतर हो रही है।", trendDecliningMessage: "पहले के सत्रों की तुलना में हाल की सटीकता कम हुई है।", trendStableMessage: "हाल की सटीकता अपेक्षाकृत स्थिर है।", trendNotEnoughData: "रुझान जानने के लिए हाल का पर्याप्त डेटा नहीं है।", needsMonitoring: "निगरानी आवश्यक", generallyImproving: "सामान्य रूप से सुधार", generallyStable: "सामान्य रूप से स्थिर", trendMultipleDecline: "कई संज्ञानात्मक गतिविधियों में हाल में गिरावट दिख रही है और उन पर नज़दीकी निगरानी चाहिए।", trendDecliningActivity: "{activity} में हाल में गिरावट दिखी है और निगरानी की जानी चाहिए।", trendImprovingMultiple: "कई गतिविधियों में हाल का संज्ञानात्मक प्रदर्शन बेहतर हो रहा है।", trendImprovingSome: "कुछ संज्ञानात्मक गतिविधियों में हाल का प्रदर्शन बेहतर हो रहा है, जबकि अन्य क्षेत्र स्थिर हैं।", trendStableAvailable: "उपलब्ध गतिविधियों में हाल का संज्ञानात्मक प्रदर्शन सामान्य रूप से स्थिर है।", performanceAlertTitle: "{activity} प्रदर्शन चेतावनी", monitoringAlertTitle: "{activity} को निगरानी की आवश्यकता", performanceSupportMessage: "{activity} में प्रदर्शन अभी {score}% है। अतिरिक्त सहायता की आवश्यकता हो सकती है।", performanceCurrentMessage: "{activity} में प्रदर्शन अभी {score}% है।", encourageRoutineRecall: "नियमित दिनचर्या-स्मरण अभ्यास के लिए प्रोत्साहित करें।", encouragePatternRecognition: "अतिरिक्त पैटर्न-पहचान अभ्यास के लिए प्रोत्साहित करें।", encourageObjectRecognition: "अतिरिक्त वस्तु-पहचान अभ्यास के लिए प्रोत्साहित करें।", lowReminderAdherence: "रिमाइंडर पालन कम है", lowReminderMessage: "रोगी के {count} रिमाइंडर छूटे हैं।", checkDailyRoutineAction: "जाँचें कि रोगी को दैनिक दिनचर्या का पालन करने में सहायता चाहिए या नहीं।", droppingReminderAdherence: "रिमाइंडर पालन घट रहा है", reminderAdherenceCurrent: "रिमाइंडर पालन अभी {rate}% है।", followUpMissedReminders: "छूटे रिमाइंडर के बारे में रोगी से बात करें।", memoryAlert: "स्मृति चेतावनी", attentionAlert: "ध्यान चेतावनी", reviewMemoryAction: "हाल की स्मृति गतिविधि की समीक्षा करें और नियमित अभ्यास के लिए प्रोत्साहित करें।", reviewAttentionAction: "हाल की ध्यान गतिविधि की समीक्षा करें और नियमित अभ्यास के लिए प्रोत्साहित करें।", authenticationRequired: "पहचान सत्यापन आवश्यक है।", failedToLoadConnectedPatients: "जुड़े हुए रोगियों को लोड नहीं किया जा सका", noAcceptedConnectedPatients: "इस देखभालकर्ता से कोई स्वीकृत रोगी नहीं जुड़ा है।", failedToLoadDashboardAnalytics: "डैशबोर्ड विश्लेषण लोड नहीं किया जा सका", unableToLoadPatientInformation: "रोगी की जानकारी लोड नहीं की जा सकी।", unableToUpdateAction: "कार्य बदला नहीं जा सका।", actionNotSaved: "कार्य माँगी गई स्थिति के साथ सहेजा नहीं गया।", progressChartRange: "प्रगति चार्ट की सीमा", sessionNumber: "सत्र {number}",
};
const caregiverDashboardTemplatesTelugu = {
  allRecommendedActionsHandled: "సూచించిన అన్ని చర్యలు పూర్తయ్యాయి. క్రమం తప్పకుండా పర్యవేక్షణ కొనసాగించండి.",
  insightNotEnoughData: "జ్ఞాన పనితీరును తెలుసుకోవడానికి ఇంకా తగిన సమాచారం లేదు.", insightNoCompletedActivities: "జ్ఞాన పనితీరును తెలుసుకోవడానికి ఇంకా తగిన పూర్తయిన కార్యకలాపాలు లేవు.", strongPerformance: "మంచి పనితీరు", needsSupport: "సహాయం అవసరం", needsFocus: "శ్రద్ధ అవసరం", insightStrongMessage: "పూర్తయిన జ్ఞాన కార్యకలాపాల్లో పనితీరు బాగుంది. పురోగతిని కొనసాగించడానికి క్రమం తప్పకుండా అభ్యాసం చేయండి.", insightNeedsSupportMessage: "{activity}లో పనితీరు ప్రస్తుతం {score}% ఉంది. అదనపు అభ్యాసం మరియు సంరక్షకుల సహాయం ఉపయోగకరంగా ఉండవచ్చు.", insightNeedsFocusMessage: "{activity}కు ప్రస్తుతం అదనపు అభ్యాసం ఎక్కువగా అవసరం; ఇతర పూర్తయిన కార్యకలాపాల్లో పనితీరు బాగుంది.", insightNeedsAttentionMessage: "కొన్ని జ్ఞాన కార్యకలాపాలు ఆశించిన స్థాయి కంటే తక్కువగా ఉన్నాయి. {activity}లో పనితీరు అత్యల్పంగా ఉంది; అదనపు అభ్యాసం అవసరం.", activityPerformanceNeedsAttention: "{activity} పనితీరుపై శ్రద్ధ అవసరం.", remindersMissed: "{count} గుర్తుచూపులు మిస్ అయ్యాయి.", overallStableMessage: "ఇటీవలి జ్ఞాన పనితీరు మరియు రోజువారీ దినచర్య పాటింపు స్థిరంగా ఉన్నాయి.", overallStableAction: "క్రమం తప్పకుండా జ్ఞాన కార్యకలాపాలు మరియు రోజువారీ దినచర్యలను కొనసాగించండి.", overallNeedsAttentionMessage: "ఇటీవలి కార్యకలాపం లేదా దినచర్య పాటింపులో సంరక్షకుల శ్రద్ధ అవసరమైన అంశాలు ఉన్నాయి.", overallNeedsAttentionAction: "తక్కువ పనితీరు ఉన్న కార్యకలాపాలను సమీక్షించి, సూచించిన జ్ఞాన కార్యకలాపానికి ప్రోత్సహించండి.", overallMonitorMessage: "ఇటీవలి కొన్ని అంశాల్లో మెరుగుదలకు అవకాశం ఉంది; వాటిని గమనించాలి.", overallMonitorAction: "క్రమం తప్పకుండా జ్ఞాన కార్యకలాపాలకు ప్రోత్సహించి, మిస్ అయిన గుర్తుచూపులను పరిశీలించండి.", trendContinueMessage: "స్పష్టమైన ధోరణి తెలుసుకోవడానికి కార్యకలాపాలను కొనసాగించండి.", trendImprovingMessage: "మునుపటి సెషన్‌లతో పోలిస్తే ఇటీవలి ఖచ్చితత్వం మెరుగవుతోంది.", trendDecliningMessage: "మునుపటి సెషన్‌లతో పోలిస్తే ఇటీవలి ఖచ్చితత్వం తగ్గింది.", trendStableMessage: "ఇటీవలి ఖచ్చితత్వం సాపేక్షంగా స్థిరంగా ఉంది.", trendNotEnoughData: "ధోరణిని తెలుసుకోవడానికి ఇటీవలి సమాచారం తగినంత లేదు.", needsMonitoring: "గమనిక అవసరం", generallyImproving: "సాధారణంగా మెరుగవుతోంది", generallyStable: "సాధారణంగా స్థిరంగా ఉంది", trendMultipleDecline: "అనేక జ్ఞాన కార్యకలాపాల్లో ఇటీవలి తగ్గుదల కనిపిస్తోంది; వాటిని దగ్గరగా గమనించాలి.", trendDecliningActivity: "{activity}లో ఇటీవలి తగ్గుదల కనిపిస్తోంది; గమనించాలి.", trendImprovingMultiple: "అనేక కార్యకలాపాల్లో ఇటీవలి జ్ఞాన పనితీరు మెరుగవుతోంది.", trendImprovingSome: "కొన్ని జ్ఞాన కార్యకలాపాల్లో పనితీరు మెరుగవుతోంది, ఇతర అంశాలు స్థిరంగా ఉన్నాయి.", trendStableAvailable: "అందుబాటులో ఉన్న కార్యకలాపాల్లో ఇటీవలి జ్ఞాన పనితీరు సాధారణంగా స్థిరంగా ఉంది.", performanceAlertTitle: "{activity} పనితీరు హెచ్చరిక", monitoringAlertTitle: "{activity}కు గమనిక అవసరం", performanceSupportMessage: "{activity}లో పనితీరు ప్రస్తుతం {score}% ఉంది. అదనపు సహాయం అవసరం కావచ్చు.", performanceCurrentMessage: "{activity}లో పనితీరు ప్రస్తుతం {score}% ఉంది.", encourageRoutineRecall: "క్రమం తప్పకుండా దినచర్య గుర్తింపు అభ్యాసానికి ప్రోత్సహించండి.", encouragePatternRecognition: "అదనపు నమూనా గుర్తింపు అభ్యాసానికి ప్రోత్సహించండి.", encourageObjectRecognition: "అదనపు వస్తు గుర్తింపు అభ్యాసానికి ప్రోత్సహించండి.", lowReminderAdherence: "గుర్తుచూపు పాటింపు తక్కువగా ఉంది", lowReminderMessage: "రోగి {count} గుర్తుచూపులను మిస్ అయ్యారు.", checkDailyRoutineAction: "రోజువారీ దినచర్యను పాటించడానికి రోగికి సహాయం అవసరమా అని చూడండి.", droppingReminderAdherence: "గుర్తుచూపు పాటింపు తగ్గుతోంది", reminderAdherenceCurrent: "గుర్తుచూపు పాటింపు ప్రస్తుతం {rate}% ఉంది.", followUpMissedReminders: "మిస్ అయిన గుర్తుచూపుల గురించి రోగితో మాట్లాడండి.", memoryAlert: "జ్ఞాపకశక్తి హెచ్చరిక", attentionAlert: "శ్రద్ధ హెచ్చరిక", reviewMemoryAction: "ఇటీవలి జ్ఞాపకశక్తి కార్యకలాపాన్ని సమీక్షించి, క్రమం తప్పకుండా అభ్యాసానికి ప్రోత్సహించండి.", reviewAttentionAction: "ఇటీవలి శ్రద్ధ కార్యకలాపాన్ని సమీక్షించి, క్రమం తప్పకుండా అభ్యాసానికి ప్రోత్సహించండి.", authenticationRequired: "గుర్తింపు నిర్ధారణ అవసరం.", failedToLoadConnectedPatients: "అనుసంధానమైన రోగులను లోడ్ చేయలేకపోయాము", noAcceptedConnectedPatients: "ఈ సంరక్షకులతో అనుసంధానమైన ఆమోదిత రోగులు లేరు.", failedToLoadDashboardAnalytics: "డ్యాష్‌బోర్డ్ విశ్లేషణను లోడ్ చేయలేకపోయాము", unableToLoadPatientInformation: "రోగి సమాచారాన్ని లోడ్ చేయలేకపోయాము.", unableToUpdateAction: "చర్యను నవీకరించలేకపోయాము.", actionNotSaved: "అభ్యర్థించిన స్థితితో చర్య సేవ్ కాలేదు.", progressChartRange: "పురోగతి చార్ట్ పరిధి", sessionNumber: "సెషన్ {number}",
};
const caregiverDashboardTemplatesAssamese = {
  allRecommendedActionsHandled: "সকলো পৰামৰ্শ দিয়া কাম সম্পূৰ্ণ কৰা হৈছে। নিয়মিত নিৰীক্ষণ চলাই যাওক।",
  insightNotEnoughData: "জ্ঞানীয় প্ৰদৰ্শন নিৰ্ণয় কৰিবলৈ এতিয়াও পৰ্যাপ্ত তথ্য নাই।", insightNoCompletedActivities: "জ্ঞানীয় প্ৰদৰ্শন নিৰ্ণয় কৰিবলৈ এতিয়াও পৰ্যাপ্ত সম্পূৰ্ণ কাৰ্যকলাপ নাই।", strongPerformance: "ভাল প্ৰদৰ্শন", needsSupport: "সহায়ৰ প্ৰয়োজন", needsFocus: "মনোযোগৰ প্ৰয়োজন", insightStrongMessage: "সম্পূৰ্ণ কৰা জ্ঞানীয় কাৰ্যকলাপসমূহত প্ৰদৰ্শন ভাল। অগ্ৰগতি বজাই ৰাখিবলৈ নিয়মিত অনুশীলন চলাই যাওক।", insightNeedsSupportMessage: "{activity}ত বৰ্তমান প্ৰদৰ্শন {score}%। অতিৰিক্ত অনুশীলন আৰু যত্নদাতাৰ সহায় উপযোগী হ'ব পাৰে।", insightNeedsFocusMessage: "{activity}ত বৰ্তমান অতিৰিক্ত অনুশীলনৰ প্ৰয়োজন বেছি, আন সম্পূৰ্ণ কাৰ্যকলাপসমূহত প্ৰদৰ্শন ভাল।", insightNeedsAttentionMessage: "কিছুমান জ্ঞানীয় কাৰ্যকলাপ আশা কৰা স্তৰৰ তলত আছে। {activity}ত প্ৰদৰ্শন আটাইতকৈ কম; অতিৰিক্ত অনুশীলন দরকাৰ।", activityPerformanceNeedsAttention: "{activity}ৰ প্ৰদৰ্শনত মনোযোগৰ প্ৰয়োজন।", remindersMissed: "{count}টা সোঁৱৰণী বাদ পৰিল।", overallStableMessage: "শেহতীয়া জ্ঞানীয় প্ৰদৰ্শন আৰু দৈনিক দিনচৰ্যা মানি চলা স্থিৰ আছে।", overallStableAction: "নিয়মিত জ্ঞানীয় কাৰ্যকলাপ আৰু দৈনিক দিনচৰ্যা চলাই যাওক।", overallNeedsAttentionMessage: "শেহতীয়া কাৰ্যকলাপ বা দিনচৰ্যা মানি চলাত যত্নদাতাৰ মনোযোগ প্ৰয়োজন হোৱা ক্ষেত্ৰ আছে।", overallNeedsAttentionAction: "কম প্ৰদৰ্শন থকা কাৰ্যকলাপসমূহ পৰ্যালোচনা কৰক আৰু পৰামৰ্শ দিয়া জ্ঞানীয় কাৰ্যকলাপলৈ উৎসাহিত কৰক।", overallMonitorMessage: "শেহতীয়া কিছুমান ক্ষেত্ৰত উন্নতিৰ সুযোগ আছে আৰু নিৰীক্ষণ কৰা উচিত।", overallMonitorAction: "নিয়মিত জ্ঞানীয় কাৰ্যকলাপলৈ উৎসাহিত কৰক আৰু বাদ পৰা সোঁৱৰণীসমূহৰ খবৰ লওক।", trendContinueMessage: "স্পষ্ট ধাৰা স্থাপন কৰিবলৈ কাৰ্যকলাপ চলাই যাওক।", trendImprovingMessage: "আগৰ সত্রসমূহৰ তুলনাত শেহতীয়া শুদ্ধতা উন্নতি হৈছে।", trendDecliningMessage: "আগৰ সত্রসমূহৰ তুলনাত শেহতীয়া শুদ্ধতা কমিছে।", trendStableMessage: "শেহতীয়া শুদ্ধতা তুলনামূলকভাৱে স্থিৰ আছে।", trendNotEnoughData: "ধাৰা নিৰ্ণয় কৰিবলৈ শেহতীয়া পৰ্যাপ্ত তথ্য নাই।", needsMonitoring: "নিৰীক্ষণৰ প্ৰয়োজন", generallyImproving: "সাধাৰণতে উন্নতি হৈছে", generallyStable: "সাধাৰণতে স্থিৰ", trendMultipleDecline: "একাধিক জ্ঞানীয় কাৰ্যকলাপত শেহতীয়াকৈ অৱনতি দেখা গৈছে; নিবিড়ভাৱে নিৰীক্ষণ কৰা উচিত।", trendDecliningActivity: "{activity}ত শেহতীয়া অৱনতি দেখা গৈছে; নিৰীক্ষণ কৰা উচিত।", trendImprovingMultiple: "একাধিক কাৰ্যকলাপত শেহতীয়া জ্ঞানীয় প্ৰদৰ্শন উন্নতি হৈছে।", trendImprovingSome: "কিছুমান জ্ঞানীয় কাৰ্যকলাপত শেহতীয়া প্ৰদৰ্শন উন্নতি হৈছে, আন ক্ষেত্ৰসমূহ স্থিৰ আছে।", trendStableAvailable: "উপলব্ধ কাৰ্যকলাপসমূহত শেহতীয়া জ্ঞানীয় প্ৰদৰ্শন সাধাৰণতে স্থিৰ।", performanceAlertTitle: "{activity} প্ৰদৰ্শন সতৰ্কবাণী", monitoringAlertTitle: "{activity}ৰ নিৰীক্ষণ প্ৰয়োজন", performanceSupportMessage: "{activity}ত বৰ্তমান প্ৰদৰ্শন {score}%। অতিৰিক্ত সহায়ৰ প্ৰয়োজন হ'ব পাৰে।", performanceCurrentMessage: "{activity}ত বৰ্তমান প্ৰদৰ্শন {score}%।", encourageRoutineRecall: "নিয়মিত দিনচৰ্যা স্মৰণ অনুশীলনলৈ উৎসাহিত কৰক।", encouragePatternRecognition: "অতিৰিক্ত নমুনা চিনাক্তকৰণ অনুশীলনলৈ উৎসাহিত কৰক।", encourageObjectRecognition: "অতিৰিক্ত বস্তু চিনাক্তকৰণ অনুশীলনলৈ উৎসাহিত কৰক।", lowReminderAdherence: "সোঁৱৰণী মানি চলা কম", lowReminderMessage: "ৰোগীৰ {count}টা সোঁৱৰণী বাদ পৰিছে।", checkDailyRoutineAction: "ৰোগীক দৈনিক দিনচৰ্যা মানি চলিবলৈ সহায়ৰ প্ৰয়োজন নেকি চাওক।", droppingReminderAdherence: "সোঁৱৰণী মানি চলা কমি আছে", reminderAdherenceCurrent: "সোঁৱৰণী মানি চলা বৰ্তমান {rate}%।", followUpMissedReminders: "বাদ পৰা সোঁৱৰণীসমূহৰ বিষয়ে ৰোগীৰ লগত কথা পাতক।", memoryAlert: "স্মৃতি সতৰ্কবাণী", attentionAlert: "মনোযোগ সতৰ্কবাণী", reviewMemoryAction: "শেহতীয়া স্মৃতি কাৰ্যকলাপ পৰ্যালোচনা কৰক আৰু নিয়মিত অনুশীলনলৈ উৎসাহিত কৰক।", reviewAttentionAction: "শেহতীয়া মনোযোগ কাৰ্যকলাপ পৰ্যালোচনা কৰক আৰু নিয়মিত অনুশীলনলৈ উৎসাহিত কৰক।", authenticationRequired: "পৰিচয় নিশ্চিতকৰণৰ প্ৰয়োজন।", failedToLoadConnectedPatients: "সংযুক্ত ৰোগীসকল লোড কৰিব নোৱাৰিলে", noAcceptedConnectedPatients: "এই যত্নদাতাৰ সৈতে কোনো অনুমোদিত ৰোগী সংযুক্ত নাই।", failedToLoadDashboardAnalytics: "ডেশ্বব'ৰ্ড বিশ্লেষণ লোড কৰিব নোৱাৰিলে", unableToLoadPatientInformation: "ৰোগীৰ তথ্য লোড কৰিব নোৱাৰিলে।", unableToUpdateAction: "কাম আপডেট কৰিব নোৱাৰিলে।", actionNotSaved: "অনুৰোধ কৰা অৱস্থাত কাম সংৰক্ষণ হোৱা নাই।", progressChartRange: "অগ্ৰগতিৰ চাৰ্টৰ পৰিসৰ", sessionNumber: "সত্র {number}",
};
const caregiverDashboardTemplatesBengali = {
  allRecommendedActionsHandled: "সব প্রস্তাবিত কাজ সম্পন্ন হয়েছে। নিয়মিত পর্যবেক্ষণ চালিয়ে যান।",
  insightNotEnoughData: "জ্ঞানীয় কর্মদক্ষতা নির্ধারণের জন্য এখনও পর্যাপ্ত তথ্য নেই।", insightNoCompletedActivities: "জ্ঞানীয় কর্মদক্ষতা নির্ধারণের জন্য এখনও পর্যাপ্ত সম্পূর্ণ কার্যকলাপ নেই।", strongPerformance: "ভাল কর্মদক্ষতা", needsSupport: "সহায়তা প্রয়োজন", needsFocus: "মনোযোগ প্রয়োজন", insightStrongMessage: "সম্পূর্ণ করা জ্ঞানীয় কার্যকলাপগুলিতে কর্মদক্ষতা ভাল। অগ্রগতি বজায় রাখতে নিয়মিত অনুশীলন চালিয়ে যান।", insightNeedsSupportMessage: "{activity}-এ বর্তমান কর্মদক্ষতা {score}%। অতিরিক্ত অনুশীলন ও যত্নদাতার সহায়তা উপকারী হতে পারে।", insightNeedsFocusMessage: "{activity}-এ এখন অতিরিক্ত অনুশীলনের প্রয়োজন বেশি, অন্য সম্পূর্ণ কার্যকলাপগুলিতে কর্মদক্ষতা ভাল।", insightNeedsAttentionMessage: "কিছু জ্ঞানীয় কার্যকলাপ প্রত্যাশিত স্তরের নিচে আছে। {activity}-এ কর্মদক্ষতা সবচেয়ে কম; অতিরিক্ত অনুশীলন প্রয়োজন।", activityPerformanceNeedsAttention: "{activity}-এর কর্মদক্ষতায় মনোযোগ প্রয়োজন।", remindersMissed: "{count}টি স্মরণিকা মিস হয়েছে।", overallStableMessage: "সাম্প্রতিক জ্ঞানীয় কর্মদক্ষতা ও দৈনন্দিন রুটিন মেনে চলা স্থিতিশীল আছে।", overallStableAction: "নিয়মিত জ্ঞানীয় কার্যকলাপ ও দৈনন্দিন রুটিন চালিয়ে যান।", overallNeedsAttentionMessage: "সাম্প্রতিক কার্যকলাপ বা রুটিন মেনে চলায় এমন ক্ষেত্র আছে যাতে যত্নদাতার মনোযোগ প্রয়োজন।", overallNeedsAttentionAction: "কম কর্মদক্ষতার কার্যকলাপগুলি পর্যালোচনা করুন এবং প্রস্তাবিত জ্ঞানীয় কার্যকলাপে উৎসাহ দিন।", overallMonitorMessage: "সাম্প্রতিক কিছু ক্ষেত্রে উন্নতির সুযোগ আছে এবং পর্যবেক্ষণ করা উচিত।", overallMonitorAction: "নিয়মিত জ্ঞানীয় কার্যকলাপে উৎসাহ দিন এবং মিস হওয়া স্মরণিকার খোঁজ নিন।", trendContinueMessage: "স্পষ্ট ধারা গড়ে তুলতে কার্যকলাপ চালিয়ে যান।", trendImprovingMessage: "আগের সেশনগুলির তুলনায় সাম্প্রতিক নির্ভুলতা উন্নত হচ্ছে।", trendDecliningMessage: "আগের সেশনগুলির তুলনায় সাম্প্রতিক নির্ভুলতা কমেছে।", trendStableMessage: "সাম্প্রতিক নির্ভুলতা তুলনামূলকভাবে স্থিতিশীল।", trendNotEnoughData: "ধারা নির্ধারণের জন্য সাম্প্রতিক পর্যাপ্ত তথ্য নেই।", needsMonitoring: "পর্যবেক্ষণ প্রয়োজন", generallyImproving: "সাধারণভাবে উন্নতি হচ্ছে", generallyStable: "সাধারণভাবে স্থিতিশীল", trendMultipleDecline: "একাধিক জ্ঞানীয় কার্যকলাপে সাম্প্রতিক অবনতি দেখা যাচ্ছে; নিবিড়ভাবে পর্যবেক্ষণ করা উচিত।", trendDecliningActivity: "{activity}-এ সাম্প্রতিক অবনতি দেখা গেছে; পর্যবেক্ষণ করা উচিত।", trendImprovingMultiple: "একাধিক কার্যকলাপে সাম্প্রতিক জ্ঞানীয় কর্মদক্ষতা উন্নত হচ্ছে।", trendImprovingSome: "কিছু জ্ঞানীয় কার্যকলাপে সাম্প্রতিক কর্মদক্ষতা উন্নত হচ্ছে, অন্য ক্ষেত্রগুলি স্থিতিশীল আছে।", trendStableAvailable: "উপলব্ধ কার্যকলাপগুলিতে সাম্প্রতিক জ্ঞানীয় কর্মদক্ষতা সাধারণভাবে স্থিতিশীল।", performanceAlertTitle: "{activity} কর্মদক্ষতা সতর্কতা", monitoringAlertTitle: "{activity}-এর পর্যবেক্ষণ প্রয়োজন", performanceSupportMessage: "{activity}-এ বর্তমান কর্মদক্ষতা {score}%। অতিরিক্ত সহায়তা প্রয়োজন হতে পারে।", performanceCurrentMessage: "{activity}-এ বর্তমান কর্মদক্ষতা {score}%।", encourageRoutineRecall: "নিয়মিত দৈনন্দিন রুটিন স্মরণ অনুশীলনে উৎসাহ দিন।", encouragePatternRecognition: "অতিরিক্ত নকশা শনাক্তকরণ অনুশীলনে উৎসাহ দিন।", encourageObjectRecognition: "অতিরিক্ত বস্তু শনাক্তকরণ অনুশীলনে উৎসাহ দিন।", lowReminderAdherence: "স্মরণিকা মেনে চলা কম", lowReminderMessage: "রোগীর {count}টি স্মরণিকা মিস হয়েছে।", checkDailyRoutineAction: "দেখুন রোগীর দৈনন্দিন রুটিন মেনে চলতে সাহায্য দরকার কি না।", droppingReminderAdherence: "স্মরণিকা মেনে চলা কমছে", reminderAdherenceCurrent: "স্মরণিকা মেনে চলা বর্তমানে {rate}%।", followUpMissedReminders: "মিস হওয়া স্মরণিকা নিয়ে রোগীর সঙ্গে কথা বলুন।", memoryAlert: "স্মৃতি সতর্কতা", attentionAlert: "মনোযোগ সতর্কতা", reviewMemoryAction: "সাম্প্রতিক স্মৃতি কার্যকলাপ পর্যালোচনা করুন এবং নিয়মিত অনুশীলনে উৎসাহ দিন।", reviewAttentionAction: "সাম্প্রতিক মনোযোগ কার্যকলাপ পর্যালোচনা করুন এবং নিয়মিত অনুশীলনে উৎসাহ দিন।", authenticationRequired: "পরিচয় যাচাই প্রয়োজন।", failedToLoadConnectedPatients: "সংযুক্ত রোগীদের লোড করা যায়নি", noAcceptedConnectedPatients: "এই যত্নদাতার সঙ্গে কোনো অনুমোদিত রোগী সংযুক্ত নেই।", failedToLoadDashboardAnalytics: "ড্যাশবোর্ড বিশ্লেষণ লোড করা যায়নি", unableToLoadPatientInformation: "রোগীর তথ্য লোড করা যায়নি।", unableToUpdateAction: "কাজ হালনাগাদ করা যায়নি।", actionNotSaved: "অনুরোধ করা অবস্থায় কাজটি সংরক্ষণ করা হয়নি।", progressChartRange: "অগ্রগতি চার্টের পরিসর", sessionNumber: "সেশন {number}",
};
const caregiverDashboardTemplatesNagamese = {
  allRecommendedActionsHandled: "Sob poramorsho diya kaam pura hoishe. Niyom hoi dekhi thakibo.",
  insightNotEnoughData: "Etiya monor performance bujibole data besi nai.", insightNoCompletedActivities: "Etiya monor performance bujibole pura kora activity besi nai.", strongPerformance: "Bhal performance", needsSupport: "Help lage", needsFocus: "Dhyan lage", insightStrongMessage: "Pura kora monor activity khan te performance bhal ase. Progress rakhibole niyom hoi practice kori thakibo.", insightNeedsSupportMessage: "{activity}or performance etiya {score}% ase. Aru practice aru caregiveror help bhal hobo pare.", insightNeedsFocusMessage: "{activity} etiya besi practice lage eneka main jagah ase, baki pura kora activity khan bhal kori ase.", insightNeedsAttentionMessage: "Kisu monor activity expected levelor niche ase. {activity}or performance sob pora kom, aru practice lage.", activityPerformanceNeedsAttention: "{activity}or performance te dhyan dibo lage.", remindersMissed: "{count} ta monot korai diya miss hoishe.", overallStableMessage: "Notun monor performance aru dinik routine mani chola stable ase.", overallStableAction: "Niyom hoi monor activity aru dinik routine kori thakibo.", overallNeedsAttentionMessage: "Notun activity ba routine mani cholate caregiveror dhyan lage eneka jagah ase.", overallNeedsAttentionAction: "Kom performance thaka activity khan sabi aru poramorsho diya monor activity koribole utsah dibo.", overallMonitorMessage: "Notun kisu jagah te bhal hobar sujog ase aru dekhi thakibo lage.", overallMonitorAction: "Niyom hoi monor activity koribole utsah dibo aru miss hoishe monot korai diya khanor khobor lobo.", trendContinueMessage: "Bhalke trend bujibole activity kori thakibo.", trendImprovingMessage: "Agor session khanor tulonat notun thik thaka bhal hoi ase.", trendDecliningMessage: "Agor session khanor tulonat notun thik thaka komi ase.", trendStableMessage: "Notun thik thaka motamoti stable ase.", trendNotEnoughData: "Trend bujibole notun data besi nai.", needsMonitoring: "Dekhi thakibo lage", generallyImproving: "Motamoti bhal hoi ase", generallyStable: "Motamoti stable ase", trendMultipleDecline: "Bohut monor activity te notun komti dekha jai; bhalke dekhi thakibo lage.", trendDecliningActivity: "{activity} te notun komti dekha jai; dekhi thakibo lage.", trendImprovingMultiple: "Bohut activity te notun monor performance bhal hoi ase.", trendImprovingSome: "Kisu monor activity te notun performance bhal hoi ase, baki jagah stable ase.", trendStableAvailable: "Thaka activity khan te notun monor performance motamoti stable ase.", performanceAlertTitle: "{activity} performance alert", monitoringAlertTitle: "{activity} dekhi thakibo lage", performanceSupportMessage: "{activity}or performance etiya {score}% ase. Aru help lage hobo pare.", performanceCurrentMessage: "{activity}or performance etiya {score}% ase.", encourageRoutineRecall: "Niyom hoi dinik routine monot anibo practice koribole utsah dibo.", encouragePatternRecognition: "Aru namuna chinibo practice koribole utsah dibo.", encourageObjectRecognition: "Aru bostu chinibo practice koribole utsah dibo.", lowReminderAdherence: "Monot korai diya mani chola kom", lowReminderMessage: "Patientor {count} ta monot korai diya miss hoishe.", checkDailyRoutineAction: "Patientor dinik routine mani cholabole help lage niki sabi.", droppingReminderAdherence: "Monot korai diya mani chola komi ase", reminderAdherenceCurrent: "Monot korai diya mani chola etiya {rate}% ase.", followUpMissedReminders: "Miss hoishe monot korai diya khan loi patient logot kotha patibo.", memoryAlert: "Memory alert", attentionAlert: "Dhyan alert", reviewMemoryAction: "Notun memory activity sabi aru niyom hoi practice koribole utsah dibo.", reviewAttentionAction: "Notun dhyan activity sabi aru niyom hoi practice koribole utsah dibo.", authenticationRequired: "Porichoy verify koribo lage.", failedToLoadConnectedPatients: "Connected patient khan load hobo nai", noAcceptedConnectedPatients: "Ei caregiver logot accepted patient connect hoi nai.", failedToLoadDashboardAnalytics: "Dashboard analysis load hobo nai", unableToLoadPatientInformation: "Patientor information load hobo nai.", unableToUpdateAction: "Kaam update hobo nai.", actionNotSaved: "Kaam request kora obosthate save hoa nai.", progressChartRange: "Progress chartor range", sessionNumber: "Baitok {number}",
};
const caregiverDashboardStatusEnglish = {
  monitor: "Monitor", declining: "Declining", high: "High", medium: "Medium", low: "Low", dismissed: "Dismissed", completedSessionsAvailable: "completed sessions available", cognitiveActivity: "Cognitive Activity",
};
const caregiverDashboardStatusHindi = {
  monitor: "निगरानी करें", declining: "गिरावट", high: "उच्च", medium: "मध्यम", low: "कम", dismissed: "हटाया गया", completedSessionsAvailable: "पूर्ण सत्र उपलब्ध हैं", cognitiveActivity: "संज्ञानात्मक गतिविधि",
};
const caregiverDashboardStatusTelugu = {
  monitor: "గమనించండి", declining: "తగ్గుతోంది", high: "అధికం", medium: "మధ్యస్థం", low: "తక్కువ", dismissed: "తొలగించబడింది", completedSessionsAvailable: "పూర్తయిన సెషన్‌లు అందుబాటులో ఉన్నాయి", cognitiveActivity: "జ్ఞాన కార్యకలాపం",
};
const caregiverDashboardStatusAssamese = {
  monitor: "নিৰীক্ষণ কৰক", declining: "অৱনতি", high: "উচ্চ", medium: "মধ্যম", low: "কম", dismissed: "আঁতৰোৱা হ'ল", completedSessionsAvailable: "সম্পূৰ্ণ সত্র উপলব্ধ আছে", cognitiveActivity: "জ্ঞানীয় কাৰ্যকলাপ",
};
const caregiverDashboardStatusBengali = {
  monitor: "পর্যবেক্ষণ করুন", declining: "অবনতি", high: "উচ্চ", medium: "মধ্যম", low: "কম", dismissed: "সরানো হয়েছে", completedSessionsAvailable: "সম্পূর্ণ সেশন উপলব্ধ আছে", cognitiveActivity: "জ্ঞানীয় কার্যকলাপ",
};
const caregiverDashboardStatusNagamese = {
  monitor: "Dekhi thakibo", declining: "Komi ase", high: "Besi", medium: "Majot", low: "Kom", dismissed: "Hatai dise", completedSessionsAvailable: "Pura kora session khan thake", cognitiveActivity: "Monor activity",
};
const caregiverDashboardActivityEnglish = {
  familyFamiliarity: "Family Familiarity",
};
const caregiverDashboardActivityHindi = {
  familyFamiliarity: "परिवार परिचय",
};
const caregiverDashboardActivityTelugu = {
  familyFamiliarity: "కుటుంబ పరిచయం",
};
const caregiverDashboardActivityAssamese = {
  familyFamiliarity: "পৰিয়াল পৰিচিতি",
};
const caregiverDashboardActivityBengali = {
  familyFamiliarity: "পরিবার পরিচিতি",
};
const caregiverDashboardActivityNagamese = {
  familyFamiliarity: "Ghoror manu chinaki",
};

const caregiverReportEnglish = {
  exportAnalysisPdf: "Export Analysis PDF", noActiveCognitiveOrReminderAlerts: "No active cognitive or reminder alerts.", noPendingCaregiverActions: "No pending caregiver actions.", overallProgressGraph: "Overall Progress Graph", graphAccuracyDescription: "Accuracy across the selected sessions.", availableSessions: "available sessions", recentSessions: "recent sessions", overallCognitivePerformanceGraph: "Overall cognitive performance graph", noCompletedSessionsForGraph: "No completed sessions are available for the progress graph.", patientAnalysis: "MINDSET-NER Patient Analysis", generated: "Generated", code: "Code", cognitiveOverview: "Cognitive Overview", insight: "Insight", activity: "Activity", performance: "Performance", recentTrend: "Recent trend", notAvailable: "Not available", dailyWellbeing: "Daily Wellbeing", noMoodCheckRecorded: "No mood check recorded", noReminderDataAvailable: "No reminder data available", activeAlerts: "Active Alerts", caregiverActionPlan: "Caregiver Action Plan", reportDisclaimer: "This report is generated from the patient's current MINDSET-NER dashboard data. It is for caregiver support and monitoring, not a medical diagnosis.", allowPopupsToExportPdf: "Please allow pop-ups to export the patient analysis as a PDF.", noCompletedSessions: "No completed sessions", prioritySuffix: "priority",
};
const caregiverReportHindi = {
  exportAnalysisPdf: "विश्लेषण PDF निर्यात करें", noActiveCognitiveOrReminderAlerts: "कोई सक्रिय संज्ञानात्मक या रिमाइंडर चेतावनी नहीं है।", noPendingCaregiverActions: "देखभालकर्ता के लिए कोई लंबित कार्य नहीं है।", overallProgressGraph: "कुल प्रगति ग्राफ", graphAccuracyDescription: "चुने गए सत्रों में सटीकता।", availableSessions: "उपलब्ध सत्र", recentSessions: "हाल के सत्र", overallCognitivePerformanceGraph: "कुल संज्ञानात्मक प्रदर्शन ग्राफ", noCompletedSessionsForGraph: "प्रगति ग्राफ के लिए कोई पूरा सत्र उपलब्ध नहीं है।", patientAnalysis: "MINDSET-NER रोगी विश्लेषण", generated: "बनाया गया", code: "कोड", cognitiveOverview: "संज्ञानात्मक सारांश", insight: "अंतर्दृष्टि", activity: "गतिविधि", performance: "प्रदर्शन", recentTrend: "हाल का रुझान", notAvailable: "उपलब्ध नहीं", dailyWellbeing: "दैनिक कल्याण", noMoodCheckRecorded: "कोई मनोदशा जाँच दर्ज नहीं है", noReminderDataAvailable: "रिमाइंडर की जानकारी उपलब्ध नहीं है", activeAlerts: "सक्रिय चेतावनियाँ", caregiverActionPlan: "देखभालकर्ता कार्य योजना", reportDisclaimer: "यह रिपोर्ट रोगी के वर्तमान MINDSET-NER डैशबोर्ड डेटा से बनाई गई है। यह देखभालकर्ता की सहायता और निगरानी के लिए है, चिकित्सकीय निदान के लिए नहीं।", allowPopupsToExportPdf: "रोगी विश्लेषण PDF निर्यात करने के लिए पॉप-अप की अनुमति दें।", noCompletedSessions: "कोई पूरा सत्र नहीं", prioritySuffix: "प्राथमिकता",
};
const caregiverReportTelugu = {
  exportAnalysisPdf: "విశ్లేషణ PDFను ఎగుమతి చేయండి", noActiveCognitiveOrReminderAlerts: "సక్రియ జ్ఞాన లేదా గుర్తుచూపు హెచ్చరికలు లేవు.", noPendingCaregiverActions: "సంరక్షకుల కోసం పెండింగ్ చర్యలు లేవు.", overallProgressGraph: "మొత్తం పురోగతి గ్రాఫ్", graphAccuracyDescription: "ఎంచుకున్న సెషన్‌లలో ఖచ్చితత్వం.", availableSessions: "అందుబాటులో ఉన్న సెషన్‌లు", recentSessions: "ఇటీవలి సెషన్‌లు", overallCognitivePerformanceGraph: "మొత్తం జ్ఞాన పనితీరు గ్రాఫ్", noCompletedSessionsForGraph: "పురోగతి గ్రాఫ్ కోసం పూర్తయిన సెషన్‌లు అందుబాటులో లేవు.", patientAnalysis: "MINDSET-NER రోగి విశ్లేషణ", generated: "సృష్టించిన సమయం", code: "కోడ్", cognitiveOverview: "జ్ఞాన సమీక్ష", insight: "అవగాహన", activity: "కార్యకలాపం", performance: "పనితీరు", recentTrend: "ఇటీవలి ధోరణి", notAvailable: "అందుబాటులో లేదు", dailyWellbeing: "రోజువారీ శ్రేయస్సు", noMoodCheckRecorded: "మానసిక స్థితి తనిఖీ నమోదు కాలేదు", noReminderDataAvailable: "గుర్తుచూపు సమాచారం అందుబాటులో లేదు", activeAlerts: "సక్రియ హెచ్చరికలు", caregiverActionPlan: "సంరక్షకుల కార్యాచరణ ప్రణాళిక", reportDisclaimer: "ఈ నివేదిక రోగి ప్రస్తుత MINDSET-NER డ్యాష్‌బోర్డ్ డేటా నుండి రూపొందించబడింది. ఇది సంరక్షకుల సహాయం మరియు పర్యవేక్షణ కోసం మాత్రమే; వైద్య నిర్ధారణ కాదు.", allowPopupsToExportPdf: "రోగి విశ్లేషణ PDFను ఎగుమతి చేయడానికి పాప్-అప్‌లను అనుమతించండి.", noCompletedSessions: "పూర్తయిన సెషన్‌లు లేవు", prioritySuffix: "ప్రాధాన్యత",
};
const caregiverReportAssamese = {
  exportAnalysisPdf: "বিশ্লেষণ PDF ৰপ্তানি কৰক", noActiveCognitiveOrReminderAlerts: "কোনো সক্ৰিয় জ্ঞানীয় বা সোঁৱৰণী সতৰ্কবাণী নাই।", noPendingCaregiverActions: "যত্নদাতাৰ বাবে কোনো বাকী কাম নাই।", overallProgressGraph: "সামগ্ৰিক অগ্ৰগতিৰ গ্ৰাফ", graphAccuracyDescription: "নিৰ্বাচিত সত্রসমূহৰ শুদ্ধতা।", availableSessions: "উপলব্ধ সত্র", recentSessions: "শেহতীয়া সত্র", overallCognitivePerformanceGraph: "সামগ্ৰিক জ্ঞানীয় প্ৰদৰ্শনৰ গ্ৰাফ", noCompletedSessionsForGraph: "অগ্ৰগতিৰ গ্ৰাফৰ বাবে কোনো সম্পূৰ্ণ সত্র উপলব্ধ নাই।", patientAnalysis: "MINDSET-NER ৰোগী বিশ্লেষণ", generated: "তৈয়াৰ কৰা হৈছে", code: "ক'ড", cognitiveOverview: "জ্ঞানীয় সাৰাংশ", insight: "অন্তৰ্দৃষ্টি", activity: "কাৰ্যকলাপ", performance: "প্ৰদৰ্শন", recentTrend: "শেহতীয়া ধাৰা", notAvailable: "উপলব্ধ নহয়", dailyWellbeing: "দৈনিক সুস্থতা", noMoodCheckRecorded: "কোনো মেজাজ পৰীক্ষা লিপিবদ্ধ হোৱা নাই", noReminderDataAvailable: "সোঁৱৰণীৰ তথ্য উপলব্ধ নাই", activeAlerts: "সক্ৰিয় সতৰ্কবাণী", caregiverActionPlan: "যত্নদাতাৰ কাৰ্য পৰিকল্পনা", reportDisclaimer: "এই প্ৰতিবেদন ৰোগীৰ বৰ্তমানৰ MINDSET-NER ডেশ্বব'ৰ্ড তথ্যৰ পৰা তৈয়াৰ কৰা হৈছে। ই যত্নদাতাৰ সহায় আৰু নিৰীক্ষণৰ বাবে, চিকিৎসাজনিত নিৰ্ণয়ৰ বাবে নহয়।", allowPopupsToExportPdf: "ৰোগী বিশ্লেষণ PDF ৰপ্তানি কৰিবলৈ পপ-আপৰ অনুমতি দিয়ক।", noCompletedSessions: "কোনো সম্পূৰ্ণ সত্র নাই", prioritySuffix: "অগ্ৰাধিকাৰ",
};
const caregiverReportBengali = {
  exportAnalysisPdf: "বিশ্লেষণ PDF রপ্তানি করুন", noActiveCognitiveOrReminderAlerts: "কোনো সক্রিয় জ্ঞানীয় বা স্মরণিকা সতর্কতা নেই।", noPendingCaregiverActions: "যত্নদাতার জন্য কোনো বাকি কাজ নেই।", overallProgressGraph: "সামগ্রিক অগ্রগতির গ্রাফ", graphAccuracyDescription: "নির্বাচিত সেশনগুলির নির্ভুলতা।", availableSessions: "উপলব্ধ সেশন", recentSessions: "সাম্প্রতিক সেশন", overallCognitivePerformanceGraph: "সামগ্রিক জ্ঞানীয় কর্মদক্ষতার গ্রাফ", noCompletedSessionsForGraph: "অগ্রগতির গ্রাফের জন্য কোনো সম্পূর্ণ সেশন উপলব্ধ নেই।", patientAnalysis: "MINDSET-NER রোগী বিশ্লেষণ", generated: "তৈরি করা হয়েছে", code: "কোড", cognitiveOverview: "জ্ঞানীয় সারসংক্ষেপ", insight: "অন্তর্দৃষ্টি", activity: "কার্যকলাপ", performance: "কর্মদক্ষতা", recentTrend: "সাম্প্রতিক ধারা", notAvailable: "উপলব্ধ নয়", dailyWellbeing: "দৈনন্দিন সুস্থতা", noMoodCheckRecorded: "কোনো মনের অবস্থা পরীক্ষা নথিভুক্ত হয়নি", noReminderDataAvailable: "স্মরণিকার তথ্য উপলব্ধ নেই", activeAlerts: "সক্রিয় সতর্কতা", caregiverActionPlan: "যত্নদাতার কার্যপরিকল্পনা", reportDisclaimer: "এই প্রতিবেদন রোগীর বর্তমান MINDSET-NER ড্যাশবোর্ডের তথ্য থেকে তৈরি। এটি যত্নদাতার সহায়তা ও পর্যবেক্ষণের জন্য, চিকিৎসাগত নির্ণয়ের জন্য নয়।", allowPopupsToExportPdf: "রোগী বিশ্লেষণ PDF রপ্তানির জন্য পপ-আপ অনুমতি দিন।", noCompletedSessions: "কোনো সম্পূর্ণ সেশন নেই", prioritySuffix: "অগ্রাধিকার",
};
const caregiverReportNagamese = {
  exportAnalysisPdf: "Analysis PDF bahir ulai dibo", noActiveCognitiveOrReminderAlerts: "Etiya kunu active monor ba monot korai diya alert nai.", noPendingCaregiverActions: "Caregiveror lagi baki kaam nai.", overallProgressGraph: "Mot progress graph", graphAccuracyDescription: "Bacha session khanor thik thaka.", availableSessions: "thaka session khan", recentSessions: "notun session khan", overallCognitivePerformanceGraph: "Mot monor performance graph", noCompletedSessionsForGraph: "Progress graphor lagi pura kora session nai.", patientAnalysis: "MINDSET-NER patient analysis", generated: "Bonai dise", code: "Patientor chinaki code", cognitiveOverview: "Monor overview", insight: "Bujibole paise", activity: "Kaaj-kam", performance: "Kaamor fol", recentTrend: "Notun dhara", notAvailable: "Pua nai", dailyWellbeing: "Dinik bhal thaka", noMoodCheckRecorded: "Monor obostha check record nai", noReminderDataAvailable: "Monot korai diya data nai", activeAlerts: "Active alert khan", caregiverActionPlan: "Caregiver action plan", reportDisclaimer: "Ei report patientor etiyar MINDSET-NER dashboard data pora bonai dise. Eitu caregiveror help aru monitoringor lagi, medical diagnosis nohoi.", allowPopupsToExportPdf: "Patient analysis PDF bahir ulaibole pop-up allow koribo.", noCompletedSessions: "Pura kora session nai", prioritySuffix: "agor dorkar",
};
export const UI_LANGUAGES = Object.freeze(["en-IN", "hi-IN", "te-IN", "as-IN", "bn-IN", "nag-IN"]);

const languageAliases = Object.freeze({
  en: "en-IN", "en-in": "en-IN", "en-us": "en-IN", "en-gb": "en-IN",
  hi: "hi-IN", "hi-in": "hi-IN", te: "te-IN", "te-in": "te-IN",
  as: "as-IN", "as-in": "as-IN", bn: "bn-IN", "bn-in": "bn-IN",
  nag: "nag-IN", "nag-in": "nag-IN",
});

export const normalizeUILanguage = (language) => {
  const normalized = String(language || "").trim().replace(/_/g, "-").toLowerCase();
  return languageAliases[normalized] || "en-IN";
};

const caregiverConnectPatientEnglish = {
  connectPatientHelp: "Search using the patient's unique code, then send a secure connection request.",
  findPatient: "Find your patient",
  findPatientHelp: "Enter the Patient Code shared with you.",
  searchPatient: "Search Patient",
  privacyHelp: "The code helps protect the patient's privacy.",
  patientFound: "Patient Found",
  requestSent: "Request Sent",
  sendConnectionRequest: "Send Connection Request",
  searchResultHere: "Your search result will appear here",
  verifyPatient: "Verify the patient details before sending a request.",
  privateSecure: "Private and secure",
  privateSecureHelp: "Patient details are only shared after the patient accepts your request.",
  pleaseEnterPatientId: "Please enter a Patient ID.",
  patientNotFound: "Patient not found",
  failedToSendConnectionRequest: "Failed to send connection request",
  connectionRequestSentSuccessfully: "Connection request sent successfully.",
  patientCodeExample: "e.g. PAT-12345",
};

const caregiverConnectPatientHindi = {
  connectPatientHelp: "रोगी के विशिष्ट कोड से खोजें, फिर सुरक्षित संपर्क अनुरोध भेजें।",
  findPatient: "अपने रोगी को खोजें",
  findPatientHelp: "आपके साथ साझा किया गया रोगी कोड दर्ज करें।",
  searchPatient: "रोगी खोजें",
  privacyHelp: "यह कोड रोगी की गोपनीयता सुरक्षित रखने में मदद करता है।",
  patientFound: "रोगी मिल गया",
  requestSent: "अनुरोध भेजा गया",
  sendConnectionRequest: "संपर्क अनुरोध भेजें",
  searchResultHere: "आपका खोज परिणाम यहाँ दिखाई देगा",
  verifyPatient: "अनुरोध भेजने से पहले रोगी की जानकारी जाँच लें।",
  privateSecure: "निजी और सुरक्षित",
  privateSecureHelp: "रोगी की जानकारी तभी साझा होती है जब रोगी आपका अनुरोध स्वीकार करे।",
  pleaseEnterPatientId: "कृपया रोगी आईडी दर्ज करें।",
  patientNotFound: "रोगी नहीं मिला",
  failedToSendConnectionRequest: "संपर्क अनुरोध भेजा नहीं जा सका",
  connectionRequestSentSuccessfully: "संपर्क अनुरोध सफलतापूर्वक भेज दिया गया।",
  patientCodeExample: "उदा. PAT-12345",
};

const caregiverConnectPatientTelugu = {
  connectPatientHelp: "రోగి ప్రత్యేక కోడ్‌తో వెతికి, సురక్షిత కనెక్షన్ అభ్యర్థనను పంపండి.",
  findPatient: "మీ రోగిని కనుగొనండి",
  findPatientHelp: "మీతో పంచుకున్న రోగి కోడ్‌ను నమోదు చేయండి.",
  searchPatient: "రోగిని వెతకండి",
  privacyHelp: "ఈ కోడ్ రోగి గోప్యతను కాపాడటానికి సహాయపడుతుంది.",
  patientFound: "రోగి కనిపించారు",
  requestSent: "అభ్యర్థన పంపబడింది",
  sendConnectionRequest: "కనెక్షన్ అభ్యర్థన పంపండి",
  searchResultHere: "మీ శోధన ఫలితం ఇక్కడ కనిపిస్తుంది",
  verifyPatient: "అభ్యర్థన పంపే ముందు రోగి వివరాలను తనిఖీ చేయండి.",
  privateSecure: "గోప్యంగా మరియు సురక్షితంగా",
  privateSecureHelp: "రోగి మీ అభ్యర్థనను అంగీకరించిన తర్వాత మాత్రమే వారి వివరాలు పంచబడతాయి.",
  pleaseEnterPatientId: "దయచేసి రోగి ఐడీని నమోదు చేయండి.",
  patientNotFound: "రోగి కనిపించలేదు",
  failedToSendConnectionRequest: "కనెక్షన్ అభ్యర్థనను పంపలేకపోయాము",
  connectionRequestSentSuccessfully: "కనెక్షన్ అభ్యర్థన విజయవంతంగా పంపబడింది.",
  patientCodeExample: "ఉదా. PAT-12345",
};

const caregiverConnectPatientAssamese = {
  connectPatientHelp: "ৰোগীৰ বিশেষ ক'ডেৰে বিচাৰি, সুৰক্ষিত সংযোগ অনুৰোধ পঠাওক।",
  findPatient: "আপোনাৰ ৰোগীক বিচাৰক",
  findPatientHelp: "আপোনাৰ সৈতে ভাগ কৰা ৰোগী ক'ডটো লিখক।",
  searchPatient: "ৰোগীক বিচাৰক",
  privacyHelp: "এই ক'ডে ৰোগীৰ গোপনীয়তা সুৰক্ষিত ৰখাত সহায় কৰে।",
  patientFound: "ৰোগী পোৱা গ'ল",
  requestSent: "অনুৰোধ পঠোৱা হ'ল",
  sendConnectionRequest: "সংযোগ অনুৰোধ পঠাওক",
  searchResultHere: "আপোনাৰ সন্ধানৰ ফলাফল ইয়াত দেখা যাব",
  verifyPatient: "অনুৰোধ পঠোৱাৰ আগতে ৰোগীৰ তথ্য যাচাই কৰক।",
  privateSecure: "ব্যক্তিগত আৰু সুৰক্ষিত",
  privateSecureHelp: "ৰোগীয়ে আপোনাৰ অনুৰোধ গ্ৰহণ কৰাৰ পিছতহে ৰোগীৰ তথ্য ভাগ কৰা হয়।",
  pleaseEnterPatientId: "অনুগ্ৰহ কৰি ৰোগী আইডি লিখক।",
  patientNotFound: "ৰোগী পোৱা নগ'ল",
  failedToSendConnectionRequest: "সংযোগ অনুৰোধ পঠাব নোৱাৰিলে",
  connectionRequestSentSuccessfully: "সংযোগ অনুৰোধ সফলতাৰে পঠোৱা হ'ল।",
  patientCodeExample: "যেনে: PAT-12345",
};

const caregiverConnectPatientBengali = {
  connectPatientHelp: "রোগীর বিশেষ কোড দিয়ে খুঁজুন, তারপর নিরাপদ সংযোগের অনুরোধ পাঠান।",
  findPatient: "আপনার রোগীকে খুঁজুন",
  findPatientHelp: "আপনার সঙ্গে ভাগ করা রোগীর কোড লিখুন।",
  searchPatient: "রোগী খুঁজুন",
  privacyHelp: "এই কোডটি রোগীর গোপনীয়তা রক্ষা করতে সাহায্য করে।",
  patientFound: "রোগী পাওয়া গেছে",
  requestSent: "অনুরোধ পাঠানো হয়েছে",
  sendConnectionRequest: "সংযোগের অনুরোধ পাঠান",
  searchResultHere: "আপনার অনুসন্ধানের ফল এখানে দেখা যাবে",
  verifyPatient: "অনুরোধ পাঠানোর আগে রোগীর তথ্য যাচাই করুন।",
  privateSecure: "ব্যক্তিগত ও নিরাপদ",
  privateSecureHelp: "রোগী আপনার অনুরোধ গ্রহণ করার পরেই তার তথ্য ভাগ করা হয়।",
  pleaseEnterPatientId: "অনুগ্রহ করে রোগীর আইডি লিখুন।",
  patientNotFound: "রোগী পাওয়া যায়নি",
  failedToSendConnectionRequest: "সংযোগের অনুরোধ পাঠানো যায়নি",
  connectionRequestSentSuccessfully: "সংযোগের অনুরোধ সফলভাবে পাঠানো হয়েছে।",
  patientCodeExample: "যেমন: PAT-12345",
};

const caregiverConnectPatientNagamese = {
  connectPatientHelp: "Patientor alag code loi bisari, tar pisot secure connection request pathabo.",
  findPatient: "Apunar patient bisaribo",
  findPatientHelp: "Apunak diya patient code tu dibo.",
  searchPatient: "Patient bisaribo",
  privacyHelp: "Ei code e patientor private information bachaibo help kore.",
  patientFound: "Patient pabo parese",
  requestSent: "Request pathaise",
  sendConnectionRequest: "Connection request pathabo",
  searchResultHere: "Apunar bisara result yate dekha jabo",
  verifyPatient: "Request pathar age patientor details check koribo.",
  privateSecure: "Private aru secure",
  privateSecureHelp: "Patient e apunar request accept korar pisote he patientor details share hobo.",
  pleaseEnterPatientId: "Patient ID dibo.",
  patientNotFound: "Patient pua nai",
  failedToSendConnectionRequest: "Connection request pathabo para nai",
  connectionRequestSentSuccessfully: "Connection request bhalke pathaise.",
  patientCodeExample: "Jene: PAT-12345",
};

Object.assign(caregiverDashboardEnglish, caregiverConnectPatientEnglish);
Object.assign(caregiverDashboardHindi, caregiverConnectPatientHindi);
Object.assign(caregiverDashboardTelugu, caregiverConnectPatientTelugu);
Object.assign(caregiverDashboardAssamese, caregiverConnectPatientAssamese);
Object.assign(caregiverDashboardBengali, caregiverConnectPatientBengali);
Object.assign(caregiverDashboardNagamese, caregiverConnectPatientNagamese);

const caregiverEmergencyAlertsEnglish = {
  patientSafety: "Patient Safety",
  emergencyAlerts: "Wandering & Emergency Alerts",
  alertsNeedAttention: "alerts need attention.",
  alertsNeedAttentionCount: "{count} alerts need attention.",
  showAllAlertsCount: "Show all {count} alerts",
  noActiveAlerts: "No active wandering alerts.",
  notificationsEnabled: "Notifications enabled",
  enableNotifications: "Enable emergency notifications",
  sendTestNotification: "Send test notification",
  enableSafeZone: "Enable safe-zone monitoring",
  latitude: "Latitude",
  longitude: "Longitude",
  radiusMetres: "Radius (m)",
  saving: "Saving…",
  saveSafeZone: "Save safe zone",
  wanderingAlert: "Wandering Alert",
  lastKnown: "Last known location",
  directions: "Directions",
  acknowledge: "Acknowledge",
  resolve: "Resolve",
  alerts: "alerts",
  distanceKilometersOutside: "{distance} km outside",
  distanceMetersOutside: "{distance} m outside",
  unableToSaveSafeZone: "Unable to save safe zone",
  safeZoneActive: "Safe zone is active.",
  safeZoneMonitoringOff: "Safe zone is saved but monitoring is off.",
  emergencyNotificationsEnabled: "Emergency notifications are enabled on this device.",
  notificationPermissionBrowserSettings: "Notification permission was not granted. Enable it in browser or app settings.",
  notificationPermissionAndroidSettings: "Notification permission was not granted. Enable it in Android app settings.",
  testEmergencyNotificationSent: "Test emergency notification sent. Check the notification shade.",
  testNotificationNotSent: "Test notification could not be sent.",
  activeAlert: "Active",
  acknowledged: "Acknowledged",
  resolved: "Resolved",
};

const caregiverEmergencyAlertsHindi = {
  patientSafety: "रोगी सुरक्षा",
  emergencyAlerts: "भटकने और आपातकालीन चेतावनियाँ",
  alertsNeedAttention: "चेतावनियों पर ध्यान देने की आवश्यकता है।",
  alertsNeedAttentionCount: "{count} चेतावनियों पर ध्यान देने की आवश्यकता है।",
  showAllAlertsCount: "सभी {count} चेतावनियाँ दिखाएँ",
  noActiveAlerts: "अभी कोई सक्रिय भटकने की चेतावनी नहीं है।",
  notificationsEnabled: "सूचनाएँ सक्षम हैं",
  enableNotifications: "आपातकालीन सूचनाएँ सक्षम करें",
  sendTestNotification: "परीक्षण सूचना भेजें",
  enableSafeZone: "सुरक्षित क्षेत्र की निगरानी सक्षम करें",
  latitude: "अक्षांश",
  longitude: "देशांतर",
  radiusMetres: "दायरा (मीटर)",
  saving: "सहेजा जा रहा है…",
  saveSafeZone: "सुरक्षित क्षेत्र सहेजें",
  wanderingAlert: "भटकने की चेतावनी",
  lastKnown: "अंतिम ज्ञात स्थान",
  directions: "दिशाएँ",
  acknowledge: "देख लिया",
  resolve: "समाधान करें",
  alerts: "चेतावनियाँ",
  distanceKilometersOutside: "{distance} किमी क्षेत्र से बाहर",
  distanceMetersOutside: "{distance} मीटर क्षेत्र से बाहर",
  unableToSaveSafeZone: "सुरक्षित क्षेत्र सहेजा नहीं जा सका",
  safeZoneActive: "सुरक्षित क्षेत्र सक्रिय है।",
  safeZoneMonitoringOff: "सुरक्षित क्षेत्र सहेज दिया गया है, लेकिन निगरानी बंद है।",
  emergencyNotificationsEnabled: "इस उपकरण पर आपातकालीन सूचनाएँ सक्षम हैं।",
  notificationPermissionBrowserSettings: "सूचना की अनुमति नहीं दी गई। इसे ब्राउज़र या ऐप की सेटिंग में सक्षम करें।",
  notificationPermissionAndroidSettings: "सूचना की अनुमति नहीं दी गई। इसे Android ऐप की सेटिंग में सक्षम करें।",
  testEmergencyNotificationSent: "परीक्षण आपातकालीन सूचना भेज दी गई है। सूचना पैनल देखें।",
  testNotificationNotSent: "परीक्षण सूचना भेजी नहीं जा सकी।",
  activeAlert: "सक्रिय",
  acknowledged: "देख लिया गया",
  resolved: "समाधान हो गया",
};

const caregiverEmergencyAlertsTelugu = {
  patientSafety: "రోగి భద్రత",
  emergencyAlerts: "తిరుగుడు మరియు అత్యవసర హెచ్చరికలు",
  alertsNeedAttention: "హెచ్చరికలకు శ్రద్ధ అవసరం.",
  alertsNeedAttentionCount: "{count} హెచ్చరికలకు శ్రద్ధ అవసరం.",
  showAllAlertsCount: "మొత్తం {count} హెచ్చరికలను చూపండి",
  noActiveAlerts: "ప్రస్తుతం క్రియాశీల తిరుగుడు హెచ్చరికలు లేవు.",
  notificationsEnabled: "నోటిఫికేషన్లు ప్రారంభించబడ్డాయి",
  enableNotifications: "అత్యవసర నోటిఫికేషన్లను ప్రారంభించండి",
  sendTestNotification: "పరీక్ష నోటిఫికేషన్ పంపండి",
  enableSafeZone: "సురక్షిత ప్రాంత పర్యవేక్షణను ప్రారంభించండి",
  latitude: "అక్షాంశం",
  longitude: "రేఖాంశం",
  radiusMetres: "వ్యాసార్థం (మీ)",
  saving: "సేవ్ అవుతోంది…",
  saveSafeZone: "సురక్షిత ప్రాంతాన్ని సేవ్ చేయండి",
  wanderingAlert: "తిరుగుడు హెచ్చరిక",
  lastKnown: "చివరిగా తెలిసిన స్థానం",
  directions: "దిశలు",
  acknowledge: "చూశాను",
  resolve: "పరిష్కరించండి",
  alerts: "హెచ్చరికలు",
  distanceKilometersOutside: "ప్రాంతం వెలుపల {distance} కిమీ",
  distanceMetersOutside: "ప్రాంతం వెలుపల {distance} మీటర్లు",
  unableToSaveSafeZone: "సురక్షిత ప్రాంతాన్ని సేవ్ చేయలేకపోయాము",
  safeZoneActive: "సురక్షిత ప్రాంతం క్రియాశీలంగా ఉంది.",
  safeZoneMonitoringOff: "సురక్షిత ప్రాంతం సేవ్ అయింది, కానీ పర్యవేక్షణ నిలిపివేయబడింది.",
  emergencyNotificationsEnabled: "ఈ పరికరంలో అత్యవసర నోటిఫికేషన్లు ప్రారంభించబడ్డాయి.",
  notificationPermissionBrowserSettings: "నోటిఫికేషన్ అనుమతి ఇవ్వబడలేదు. బ్రౌజర్ లేదా యాప్ సెట్టింగ్‌లలో దీన్ని ప్రారంభించండి.",
  notificationPermissionAndroidSettings: "నోటిఫికేషన్ అనుమతి ఇవ్వబడలేదు. Android యాప్ సెట్టింగ్‌లలో దీన్ని ప్రారంభించండి.",
  testEmergencyNotificationSent: "పరీక్ష అత్యవసర నోటిఫికేషన్ పంపబడింది. నోటిఫికేషన్ ప్యానెల్‌ను చూడండి.",
  testNotificationNotSent: "పరీక్ష నోటిఫికేషన్ పంపలేకపోయాము.",
  activeAlert: "క్రియాశీలం",
  acknowledged: "చూసినట్లు గుర్తించబడింది",
  resolved: "పరిష్కరించబడింది",
};

const caregiverEmergencyAlertsAssamese = {
  patientSafety: "ৰোগীৰ সুৰক্ষা",
  emergencyAlerts: "ঘূৰি ফুৰা আৰু জৰুৰী সতৰ্কবাণী",
  alertsNeedAttention: "সতৰ্কবাণীসমূহত মনোযোগৰ প্ৰয়োজন।",
  alertsNeedAttentionCount: "{count}টা সতৰ্কবাণীত মনোযোগৰ প্ৰয়োজন।",
  showAllAlertsCount: "সকলো {count}টা সতৰ্কবাণী দেখুৱাওক",
  noActiveAlerts: "বৰ্তমান কোনো সক্ৰিয় ঘূৰি ফুৰা সতৰ্কবাণী নাই।",
  notificationsEnabled: "জাননী সক্ৰিয় আছে",
  enableNotifications: "জৰুৰী জাননী সক্ৰিয় কৰক",
  sendTestNotification: "পৰীক্ষামূলক জাননী পঠাওক",
  enableSafeZone: "সুৰক্ষিত অঞ্চল নিৰীক্ষণ সক্ৰিয় কৰক",
  latitude: "অক্ষাংশ",
  longitude: "দ্ৰাঘিমাংশ",
  radiusMetres: "ব্যাসাৰ্ধ (মিটাৰ)",
  saving: "সংৰক্ষণ হৈ আছে…",
  saveSafeZone: "সুৰক্ষিত অঞ্চল সংৰক্ষণ কৰক",
  wanderingAlert: "ঘূৰি ফুৰা সতৰ্কবাণী",
  lastKnown: "শেষে জনা স্থান",
  directions: "দিশ-নিৰ্দেশ",
  acknowledge: "দেখা হ'ল",
  resolve: "সমাধান কৰক",
  alerts: "সতৰ্কবাণী",
  distanceKilometersOutside: "অঞ্চলৰ বাহিৰত {distance} কিমি",
  distanceMetersOutside: "অঞ্চলৰ বাহিৰত {distance} মিটাৰ",
  unableToSaveSafeZone: "সুৰক্ষিত অঞ্চল সংৰক্ষণ কৰিব নোৱাৰিলে",
  safeZoneActive: "সুৰক্ষিত অঞ্চল সক্ৰিয় আছে।",
  safeZoneMonitoringOff: "সুৰক্ষিত অঞ্চল সংৰক্ষণ কৰা হৈছে, কিন্তু নিৰীক্ষণ বন্ধ আছে।",
  emergencyNotificationsEnabled: "এই যন্ত্ৰত জৰুৰী জাননী সক্ৰিয় আছে।",
  notificationPermissionBrowserSettings: "জাননীৰ অনুমতি দিয়া হোৱা নাই। ব্ৰাউজাৰ বা এপৰ ছেটিংছত ইয়াক সক্ৰিয় কৰক।",
  notificationPermissionAndroidSettings: "জাননীৰ অনুমতি দিয়া হোৱা নাই। Android এপৰ ছেটিংছত ইয়াক সক্ৰিয় কৰক।",
  testEmergencyNotificationSent: "পৰীক্ষামূলক জৰুৰী জাননী পঠোৱা হ'ল। জাননী পেনেল চাওক।",
  testNotificationNotSent: "পৰীক্ষামূলক জাননী পঠাব নোৱাৰিলে।",
  activeAlert: "সক্ৰিয়",
  acknowledged: "দেখা হ'ল",
  resolved: "সমাধান কৰা হ'ল",
};

const caregiverEmergencyAlertsBengali = {
  patientSafety: "রোগীর নিরাপত্তা",
  emergencyAlerts: "ঘোরাঘুরি ও জরুরি সতর্কতা",
  alertsNeedAttention: "সতর্কতাগুলিতে মনোযোগ প্রয়োজন।",
  alertsNeedAttentionCount: "{count}টি সতর্কতায় মনোযোগ প্রয়োজন।",
  showAllAlertsCount: "সব {count}টি সতর্কতা দেখান",
  noActiveAlerts: "এখন কোনো সক্রিয় ঘোরাঘুরির সতর্কতা নেই।",
  notificationsEnabled: "বিজ্ঞপ্তি চালু আছে",
  enableNotifications: "জরুরি বিজ্ঞপ্তি চালু করুন",
  sendTestNotification: "পরীক্ষার বিজ্ঞপ্তি পাঠান",
  enableSafeZone: "নিরাপদ এলাকা পর্যবেক্ষণ চালু করুন",
  latitude: "অক্ষাংশ",
  longitude: "দ্রাঘিমাংশ",
  radiusMetres: "ব্যাসার্ধ (মিটার)",
  saving: "সংরক্ষণ করা হচ্ছে…",
  saveSafeZone: "নিরাপদ এলাকা সংরক্ষণ করুন",
  wanderingAlert: "ঘোরাঘুরির সতর্কতা",
  lastKnown: "সর্বশেষ জানা অবস্থান",
  directions: "দিকনির্দেশ",
  acknowledge: "দেখেছি",
  resolve: "সমাধান করুন",
  alerts: "সতর্কতা",
  distanceKilometersOutside: "এলাকার বাইরে {distance} কিমি",
  distanceMetersOutside: "এলাকার বাইরে {distance} মিটার",
  unableToSaveSafeZone: "নিরাপদ এলাকা সংরক্ষণ করা যায়নি",
  safeZoneActive: "নিরাপদ এলাকা সক্রিয় আছে।",
  safeZoneMonitoringOff: "নিরাপদ এলাকা সংরক্ষণ করা হয়েছে, কিন্তু পর্যবেক্ষণ বন্ধ আছে।",
  emergencyNotificationsEnabled: "এই ডিভাইসে জরুরি বিজ্ঞপ্তি চালু আছে।",
  notificationPermissionBrowserSettings: "বিজ্ঞপ্তির অনুমতি দেওয়া হয়নি। ব্রাউজার বা অ্যাপের সেটিংসে এটি চালু করুন।",
  notificationPermissionAndroidSettings: "বিজ্ঞপ্তির অনুমতি দেওয়া হয়নি। Android অ্যাপের সেটিংসে এটি চালু করুন।",
  testEmergencyNotificationSent: "পরীক্ষার জরুরি বিজ্ঞপ্তি পাঠানো হয়েছে। বিজ্ঞপ্তি প্যানেল দেখুন।",
  testNotificationNotSent: "পরীক্ষার বিজ্ঞপ্তি পাঠানো যায়নি।",
  activeAlert: "সক্রিয়",
  acknowledged: "দেখা হয়েছে",
  resolved: "সমাধান করা হয়েছে",
};

const caregiverEmergencyAlertsNagamese = {
  patientSafety: "Patientor safety",
  emergencyAlerts: "Ghumai phura aru emergency alert",
  alertsNeedAttention: "alert khan te dhyan dibo lage.",
  alertsNeedAttentionCount: "{count} ta alert khan te dhyan dibo lage.",
  showAllAlertsCount: "Sob {count} ta alert dekhaibo",
  noActiveAlerts: "Etiya active ghumai phura alert nai.",
  notificationsEnabled: "Notification chalu ase",
  enableNotifications: "Emergency notification chalu koribo",
  sendTestNotification: "Test notification pathabo",
  enableSafeZone: "Safe zone monitoring chalu koribo",
  latitude: "Latitude",
  longitude: "Longitude",
  radiusMetres: "Radius (meter)",
  saving: "Save hoi ase…",
  saveSafeZone: "Safe zone save koribo",
  wanderingAlert: "Ghumai phura alert",
  lastKnown: "Ses jana location",
  directions: "Jabor rasta",
  acknowledge: "Dekhi luwa",
  resolve: "Solve koribo",
  alerts: "alert khan",
  distanceKilometersOutside: "{distance} km bahirot",
  distanceMetersOutside: "{distance} meter bahirot",
  unableToSaveSafeZone: "Safe zone save koribo para nai",
  safeZoneActive: "Safe zone chalu ase.",
  safeZoneMonitoringOff: "Safe zone save hoishe, kintu monitoring bondho ase.",
  emergencyNotificationsEnabled: "Ei device te emergency notification chalu ase.",
  notificationPermissionBrowserSettings: "Notification permission diya nai. Browser ba app settings te chalu koribo.",
  notificationPermissionAndroidSettings: "Notification permission diya nai. Android app settings te chalu koribo.",
  testEmergencyNotificationSent: "Test emergency notification pathaise. Notification shade sabi.",
  testNotificationNotSent: "Test notification pathabo para nai.",
  activeAlert: "Chalu",
  acknowledged: "Dekha hoishe",
  resolved: "Solve hoishe",
};

Object.assign(caregiverDashboardEnglish, caregiverEmergencyAlertsEnglish);
Object.assign(caregiverDashboardHindi, caregiverEmergencyAlertsHindi);
Object.assign(caregiverDashboardTelugu, caregiverEmergencyAlertsTelugu);
Object.assign(caregiverDashboardAssamese, caregiverEmergencyAlertsAssamese);
Object.assign(caregiverDashboardBengali, caregiverEmergencyAlertsBengali);
Object.assign(caregiverDashboardNagamese, caregiverEmergencyAlertsNagamese);

const emergencyAlertMapEnglish = {
  patientReachedSafeZone: "Patient reached the safe zone",
  navigationInProgress: "Navigation in progress",
  recoveryRouteReady: "Recovery route ready",
  latestLocationInsideSafeZone: "The latest patient location is inside the configured safe zone.",
  distanceRemainingToSafeZone: "{distance} m remaining to the safe zone",
  expandMap: "Expand map",
  stopNavigation: "Stop navigation",
  startNavigation: "Start navigation",
  closeFullScreenMap: "Close full-screen map",
  recoveryNavigation: "Recovery Navigation",
  routePreview: "Route preview",
  patientLastKnownLocation: "Patient's last known location",
  destination: "Destination",
  configuredSafeZone: "Configured safe zone",
  patientInsideSafeZone: "Patient is inside the safe zone",
  distanceToDestination: "{distance} m to destination",
  mapSafeZoneToLastKnownLocation: "Map from the patient's safe zone to last known location",
  destinationSafeZone: "Destination: safe zone",
  startPatientLocation: "Start: patient location",
  safeZone: "Safe zone",
};

const emergencyAlertMapHindi = {
  patientReachedSafeZone: "रोगी सुरक्षित क्षेत्र में पहुँच गया है",
  navigationInProgress: "मार्गदर्शन जारी है",
  recoveryRouteReady: "वापसी का मार्ग तैयार है",
  latestLocationInsideSafeZone: "रोगी का नवीनतम स्थान निर्धारित सुरक्षित क्षेत्र के भीतर है।",
  distanceRemainingToSafeZone: "सुरक्षित क्षेत्र तक {distance} मीटर बाकी",
  expandMap: "मानचित्र बड़ा करें",
  stopNavigation: "मार्गदर्शन रोकें",
  startNavigation: "मार्गदर्शन शुरू करें",
  closeFullScreenMap: "पूर्ण-स्क्रीन मानचित्र बंद करें",
  recoveryNavigation: "वापसी मार्गदर्शन",
  routePreview: "मार्ग का पूर्वावलोकन",
  patientLastKnownLocation: "रोगी का अंतिम ज्ञात स्थान",
  destination: "गंतव्य",
  configuredSafeZone: "निर्धारित सुरक्षित क्षेत्र",
  patientInsideSafeZone: "रोगी सुरक्षित क्षेत्र के भीतर है",
  distanceToDestination: "गंतव्य तक {distance} मीटर",
  mapSafeZoneToLastKnownLocation: "रोगी के सुरक्षित क्षेत्र से अंतिम ज्ञात स्थान तक का मानचित्र",
  destinationSafeZone: "गंतव्य: सुरक्षित क्षेत्र",
  startPatientLocation: "शुरुआत: रोगी का स्थान",
  safeZone: "सुरक्षित क्षेत्र",
};

const emergencyAlertMapTelugu = {
  patientReachedSafeZone: "రోగి సురక్షిత ప్రాంతానికి చేరుకున్నారు",
  navigationInProgress: "మార్గదర్శనం కొనసాగుతోంది",
  recoveryRouteReady: "తిరిగి చేరే మార్గం సిద్ధంగా ఉంది",
  latestLocationInsideSafeZone: "రోగి చివరిగా ఉన్న స్థానం నిర్ణయించిన సురక్షిత ప్రాంతంలోనే ఉంది.",
  distanceRemainingToSafeZone: "సురక్షిత ప్రాంతానికి ఇంకా {distance} మీటర్లు",
  expandMap: "మ్యాప్‌ను విస్తరించండి",
  stopNavigation: "మార్గదర్శనం ఆపండి",
  startNavigation: "మార్గదర్శనం ప్రారంభించండి",
  closeFullScreenMap: "పూర్తి స్క్రీన్ మ్యాప్‌ను మూసివేయండి",
  recoveryNavigation: "తిరిగి చేరే మార్గదర్శనం",
  routePreview: "మార్గం ముందస్తు వీక్షణ",
  patientLastKnownLocation: "రోగి చివరిగా తెలిసిన స్థానం",
  destination: "గమ్యం",
  configuredSafeZone: "నిర్ణయించిన సురక్షిత ప్రాంతం",
  patientInsideSafeZone: "రోగి సురక్షిత ప్రాంతంలో ఉన్నారు",
  distanceToDestination: "గమ్యానికి {distance} మీటర్లు",
  mapSafeZoneToLastKnownLocation: "రోగి సురక్షిత ప్రాంతం నుండి చివరిగా తెలిసిన స్థానం వరకు మ్యాప్",
  destinationSafeZone: "గమ్యం: సురక్షిత ప్రాంతం",
  startPatientLocation: "ప్రారంభం: రోగి స్థానం",
  safeZone: "సురక్షిత ప్రాంతం",
};

const emergencyAlertMapAssamese = {
  patientReachedSafeZone: "ৰোগী সুৰক্ষিত অঞ্চলত উপনীত হৈছে",
  navigationInProgress: "পথ-নিৰ্দেশনা চলি আছে",
  recoveryRouteReady: "উভতি যোৱাৰ পথ সাজু আছে",
  latestLocationInsideSafeZone: "ৰোগীৰ শেহতীয়া স্থান নিৰ্ধাৰিত সুৰক্ষিত অঞ্চলৰ ভিতৰত আছে।",
  distanceRemainingToSafeZone: "সুৰক্ষিত অঞ্চললৈ {distance} মিটাৰ বাকী",
  expandMap: "মানচিত্ৰ ডাঙৰ কৰক",
  stopNavigation: "পথ-নিৰ্দেশনা বন্ধ কৰক",
  startNavigation: "পথ-নিৰ্দেশনা আৰম্ভ কৰক",
  closeFullScreenMap: "সম্পূৰ্ণ-স্ক্ৰীণ মানচিত্ৰ বন্ধ কৰক",
  recoveryNavigation: "উভতি যোৱাৰ পথ-নিৰ্দেশনা",
  routePreview: "পথৰ পূৰ্বদৰ্শন",
  patientLastKnownLocation: "ৰোগীৰ শেষত জনা স্থান",
  destination: "গন্তব্য",
  configuredSafeZone: "নিৰ্ধাৰিত সুৰক্ষিত অঞ্চল",
  patientInsideSafeZone: "ৰোগী সুৰক্ষিত অঞ্চলৰ ভিতৰত আছে",
  distanceToDestination: "গন্তব্যলৈ {distance} মিটাৰ",
  mapSafeZoneToLastKnownLocation: "ৰোগীৰ সুৰক্ষিত অঞ্চলৰ পৰা শেষত জনা স্থানলৈ মানচিত্ৰ",
  destinationSafeZone: "গন্তব্য: সুৰক্ষিত অঞ্চল",
  startPatientLocation: "আৰম্ভণি: ৰোগীৰ স্থান",
  safeZone: "সুৰক্ষিত অঞ্চল",
};

const emergencyAlertMapBengali = {
  patientReachedSafeZone: "রোগী নিরাপদ এলাকায় পৌঁছেছেন",
  navigationInProgress: "পথনির্দেশ চলছে",
  recoveryRouteReady: "ফিরে আসার পথ প্রস্তুত আছে",
  latestLocationInsideSafeZone: "রোগীর সর্বশেষ অবস্থান নির্ধারিত নিরাপদ এলাকার মধ্যে আছে।",
  distanceRemainingToSafeZone: "নিরাপদ এলাকায় পৌঁছাতে আরও {distance} মিটার",
  expandMap: "মানচিত্র বড় করুন",
  stopNavigation: "পথনির্দেশ বন্ধ করুন",
  startNavigation: "পথনির্দেশ শুরু করুন",
  closeFullScreenMap: "পূর্ণ-স্ক্রিন মানচিত্র বন্ধ করুন",
  recoveryNavigation: "ফিরে আসার পথনির্দেশ",
  routePreview: "পথের পূর্বদৃশ্য",
  patientLastKnownLocation: "রোগীর সর্বশেষ জানা অবস্থান",
  destination: "গন্তব্য",
  configuredSafeZone: "নির্ধারিত নিরাপদ এলাকা",
  patientInsideSafeZone: "রোগী নিরাপদ এলাকার মধ্যে আছেন",
  distanceToDestination: "গন্তব্য পর্যন্ত {distance} মিটার",
  mapSafeZoneToLastKnownLocation: "রোগীর নিরাপদ এলাকা থেকে সর্বশেষ জানা অবস্থান পর্যন্ত মানচিত্র",
  destinationSafeZone: "গন্তব্য: নিরাপদ এলাকা",
  startPatientLocation: "শুরু: রোগীর অবস্থান",
  safeZone: "নিরাপদ এলাকা",
};

const emergencyAlertMapNagamese = {
  patientReachedSafeZone: "Patient safe zone te pahuchise",
  navigationInProgress: "Rasta dekhuwa cholise",
  recoveryRouteReady: "Ubhoti ahibor rasta ready ase",
  latestLocationInsideSafeZone: "Patientor ses location thik kora safe zoneor bhitor ase.",
  distanceRemainingToSafeZone: "Safe zone pabole aru {distance} meter baki ase",
  expandMap: "Map dangor koribo",
  stopNavigation: "Rasta dekhuwa bondho koribo",
  startNavigation: "Rasta dekhuwa shuru koribo",
  closeFullScreenMap: "Full-screen map bondho koribo",
  recoveryNavigation: "Ubhoti ahibor rasta dekhuwa",
  routePreview: "Rastar agor dekha",
  patientLastKnownLocation: "Patientor ses jana location",
  destination: "Jabo laga jagah",
  configuredSafeZone: "Thik kora safe zone",
  patientInsideSafeZone: "Patient safe zoneor bhitor ase",
  distanceToDestination: "Jabo laga jagah loi {distance} meter",
  mapSafeZoneToLastKnownLocation: "Patientor safe zone pora ses jana location loi map",
  destinationSafeZone: "Jabo laga jagah: safe zone",
  startPatientLocation: "Shuru: patientor location",
  safeZone: "Safe zone",
};

Object.assign(caregiverDashboardEnglish, emergencyAlertMapEnglish);
Object.assign(caregiverDashboardHindi, emergencyAlertMapHindi);
Object.assign(caregiverDashboardTelugu, emergencyAlertMapTelugu);
Object.assign(caregiverDashboardAssamese, emergencyAlertMapAssamese);
Object.assign(caregiverDashboardBengali, emergencyAlertMapBengali);
Object.assign(caregiverDashboardNagamese, emergencyAlertMapNagamese);

const familiarPeopleManagerEnglish = {
  familiarPeopleTraining: "Familiar people training",
  familiarPeopleDescription: "Add, review, or update a name and photo for this patient. Photos are private to their connected care team and patient account.",
  personName: "Person's name",
  personPhoto: "Person's photo",
  adding: "Adding…",
  addPerson: "Add person",
  familiarPeopleImageHelp: "Use a clear JPEG, PNG, or WebP image up to 5 MB. Select Edit to change a saved name or photo.",
  couldNotLoadFamiliarPeople: "Could not load familiar people",
  couldNotAddFamiliarPerson: "Could not add familiar person",
  familiarPersonAdded: "Familiar person added. The patient can now train with this photo.",
  couldNotUpdateFamiliarPerson: "Could not update familiar person",
  familiarPersonUpdated: "Familiar person updated.",
  confirmRemoveFamiliarPerson: "Remove this familiar person from training?",
  couldNotRemoveFamiliarPerson: "Could not remove familiar person",
  photoOfPerson: "Photo of {name}",
  nameForPerson: "Name for {name}",
  replacementPhotoForPerson: "Replacement photo for {name}",
  person: "Person",
  noFamiliarPeopleAdded: "No familiar people added yet.",
  showAllPeople: "Show all {count} people",
};

const familiarPeopleManagerHindi = {
  familiarPeopleTraining: "परिचित लोगों का प्रशिक्षण",
  familiarPeopleDescription: "इस रोगी के लिए नाम और फोटो जोड़ें, देखें या बदलें। फोटो केवल उनकी जुड़ी देखभाल टीम और रोगी खाते के लिए निजी हैं।",
  personName: "व्यक्ति का नाम",
  personPhoto: "व्यक्ति का फोटो",
  adding: "जोड़ा जा रहा है…",
  addPerson: "व्यक्ति जोड़ें",
  familiarPeopleImageHelp: "5 MB तक की साफ़ JPEG, PNG या WebP छवि चुनें। सहेजा हुआ नाम या फोटो बदलने के लिए बदलें चुनें।",
  couldNotLoadFamiliarPeople: "परिचित लोगों को लोड नहीं किया जा सका",
  couldNotAddFamiliarPerson: "परिचित व्यक्ति को जोड़ा नहीं जा सका",
  familiarPersonAdded: "परिचित व्यक्ति जोड़ दिया गया है। रोगी अब इस फोटो से प्रशिक्षण कर सकता है।",
  couldNotUpdateFamiliarPerson: "परिचित व्यक्ति को बदला नहीं जा सका",
  familiarPersonUpdated: "परिचित व्यक्ति की जानकारी बदल दी गई है।",
  confirmRemoveFamiliarPerson: "क्या इस परिचित व्यक्ति को प्रशिक्षण से हटाना है?",
  couldNotRemoveFamiliarPerson: "परिचित व्यक्ति को हटाया नहीं जा सका",
  photoOfPerson: "{name} का फोटो",
  nameForPerson: "{name} का नाम",
  replacementPhotoForPerson: "{name} के लिए नया फोटो",
  person: "व्यक्ति",
  noFamiliarPeopleAdded: "अभी कोई परिचित व्यक्ति नहीं जोड़ा गया है।",
  showAllPeople: "सभी {count} लोगों को दिखाएँ",
};

const familiarPeopleManagerTelugu = {
  familiarPeopleTraining: "పరిచయమైన వ్యక్తుల శిక్షణ",
  familiarPeopleDescription: "ఈ రోగి కోసం పేరు మరియు ఫోటోను జోడించండి, చూడండి లేదా మార్చండి. ఫోటోలు వారి అనుసంధాన సంరక్షణ బృందం మరియు రోగి ఖాతాకు మాత్రమే వ్యక్తిగతం.",
  personName: "వ్యక్తి పేరు",
  personPhoto: "వ్యక్తి ఫోటో",
  adding: "జోడిస్తోంది…",
  addPerson: "వ్యక్తిని జోడించండి",
  familiarPeopleImageHelp: "5 MB వరకు స్పష్టమైన JPEG, PNG లేదా WebP చిత్రాన్ని ఉపయోగించండి. సేవ్ చేసిన పేరు లేదా ఫోటో మార్చడానికి సవరించండి ఎంచుకోండి.",
  couldNotLoadFamiliarPeople: "పరిచయమైన వ్యక్తులను లోడ్ చేయలేకపోయాము",
  couldNotAddFamiliarPerson: "పరిచయమైన వ్యక్తిని జోడించలేకపోయాము",
  familiarPersonAdded: "పరిచయమైన వ్యక్తిని జోడించాము. రోగి ఇప్పుడు ఈ ఫోటోతో శిక్షణ పొందవచ్చు.",
  couldNotUpdateFamiliarPerson: "పరిచయమైన వ్యక్తి వివరాలను నవీకరించలేకపోయాము",
  familiarPersonUpdated: "పరిచయమైన వ్యక్తి వివరాలను నవీకరించాము.",
  confirmRemoveFamiliarPerson: "ఈ పరిచయమైన వ్యక్తిని శిక్షణ నుండి తొలగించాలా?",
  couldNotRemoveFamiliarPerson: "పరిచయమైన వ్యక్తిని తొలగించలేకపోయాము",
  photoOfPerson: "{name} ఫోటో",
  nameForPerson: "{name} పేరు",
  replacementPhotoForPerson: "{name} కోసం కొత్త ఫోటో",
  person: "వ్యక్తి",
  noFamiliarPeopleAdded: "ఇంకా పరిచయమైన వ్యక్తులను జోడించలేదు.",
  showAllPeople: "మొత్తం {count} మందిని చూపండి",
};

const familiarPeopleManagerAssamese = {
  familiarPeopleTraining: "পৰিচিত লোকৰ অনুশীলন",
  familiarPeopleDescription: "এই ৰোগীৰ বাবে নাম আৰু ফটো যোগ কৰক, চাওক বা সলনি কৰক। ফটোসমূহ কেৱল সংযুক্ত যত্ন দল আৰু ৰোগীৰ একাউণ্টৰ বাবে ব্যক্তিগত।",
  personName: "ব্যক্তিৰ নাম",
  personPhoto: "ব্যক্তিৰ ফটো",
  adding: "যোগ কৰা হৈছে…",
  addPerson: "ব্যক্তি যোগ কৰক",
  familiarPeopleImageHelp: "5 MBলৈকে স্পষ্ট JPEG, PNG বা WebP ছবি ব্যৱহাৰ কৰক। সংৰক্ষিত নাম বা ফটো সলনি কৰিবলৈ সম্পাদনা বাছক।",
  couldNotLoadFamiliarPeople: "পৰিচিত লোকসকল লোড কৰিব নোৱাৰিলে",
  couldNotAddFamiliarPerson: "পৰিচিত ব্যক্তিক যোগ কৰিব নোৱাৰিলে",
  familiarPersonAdded: "পৰিচিত ব্যক্তিক যোগ কৰা হ'ল। ৰোগীয়ে এতিয়া এই ফটোৰে অনুশীলন কৰিব পাৰে।",
  couldNotUpdateFamiliarPerson: "পৰিচিত ব্যক্তিৰ তথ্য আপডেট কৰিব নোৱাৰিলে",
  familiarPersonUpdated: "পৰিচিত ব্যক্তিৰ তথ্য আপডেট কৰা হ'ল।",
  confirmRemoveFamiliarPerson: "এই পৰিচিত ব্যক্তিক অনুশীলনৰ পৰা আঁতৰাব নে?",
  couldNotRemoveFamiliarPerson: "পৰিচিত ব্যক্তিক আঁতৰাব নোৱাৰিলে",
  photoOfPerson: "{name}ৰ ফটো",
  nameForPerson: "{name}ৰ নাম",
  replacementPhotoForPerson: "{name}ৰ বাবে সলনি ফটো",
  person: "ব্যক্তি",
  noFamiliarPeopleAdded: "এতিয়াও কোনো পৰিচিত লোক যোগ কৰা হোৱা নাই।",
  showAllPeople: "সকলো {count} জন লোক দেখুৱাওক",
};

const familiarPeopleManagerBengali = {
  familiarPeopleTraining: "পরিচিত মানুষের অনুশীলন",
  familiarPeopleDescription: "এই রোগীর জন্য নাম ও ছবি যোগ করুন, দেখুন বা বদলান। ছবিগুলি শুধু সংযুক্ত পরিচর্যা দল ও রোগীর অ্যাকাউন্টের জন্য ব্যক্তিগত।",
  personName: "ব্যক্তির নাম",
  personPhoto: "ব্যক্তির ছবি",
  adding: "যোগ করা হচ্ছে…",
  addPerson: "ব্যক্তি যোগ করুন",
  familiarPeopleImageHelp: "5 MB পর্যন্ত পরিষ্কার JPEG, PNG বা WebP ছবি ব্যবহার করুন। সংরক্ষিত নাম বা ছবি বদলাতে সম্পাদনা নির্বাচন করুন।",
  couldNotLoadFamiliarPeople: "পরিচিত মানুষদের লোড করা যায়নি",
  couldNotAddFamiliarPerson: "পরিচিত ব্যক্তিকে যোগ করা যায়নি",
  familiarPersonAdded: "পরিচিত ব্যক্তিকে যোগ করা হয়েছে। রোগী এখন এই ছবি দিয়ে অনুশীলন করতে পারবেন।",
  couldNotUpdateFamiliarPerson: "পরিচিত ব্যক্তির তথ্য হালনাগাদ করা যায়নি",
  familiarPersonUpdated: "পরিচিত ব্যক্তির তথ্য হালনাগাদ করা হয়েছে।",
  confirmRemoveFamiliarPerson: "এই পরিচিত ব্যক্তিকে অনুশীলন থেকে সরাবেন?",
  couldNotRemoveFamiliarPerson: "পরিচিত ব্যক্তিকে সরানো যায়নি",
  photoOfPerson: "{name}-এর ছবি",
  nameForPerson: "{name}-এর নাম",
  replacementPhotoForPerson: "{name}-এর জন্য বদলি ছবি",
  person: "ব্যক্তি",
  noFamiliarPeopleAdded: "এখনও কোনো পরিচিত মানুষ যোগ করা হয়নি।",
  showAllPeople: "সব {count} জনকে দেখান",
};

const familiarPeopleManagerNagamese = {
  familiarPeopleTraining: "Chinaki manu khanor practice",
  familiarPeopleDescription: "Ei patientor lagi naam aru photo joribo, sabo ba bodlabo. Photo khan kebal connected care team aru patient accountor lagi private ase.",
  personName: "Manuhor naam",
  personPhoto: "Manuhor photo",
  adding: "Jori ase…",
  addPerson: "Manuh joribo",
  familiarPeopleImageHelp: "5 MB loi clear JPEG, PNG ba WebP image use koribo. Save kora naam ba photo bodlabole Edit bachaibo.",
  couldNotLoadFamiliarPeople: "Chinaki manu khan load hobo nai",
  couldNotAddFamiliarPerson: "Chinaki manuh joribo para nai",
  familiarPersonAdded: "Chinaki manuh jori dise. Patient etiya ei photo loi practice koribo pare.",
  couldNotUpdateFamiliarPerson: "Chinaki manuhor details update koribo para nai",
  familiarPersonUpdated: "Chinaki manuhor details update kori dise.",
  confirmRemoveFamiliarPerson: "Ei chinaki manuh ke practice pora hatai dibo niki?",
  couldNotRemoveFamiliarPerson: "Chinaki manuh hataibo para nai",
  photoOfPerson: "{name}or photo",
  nameForPerson: "{name}or naam",
  replacementPhotoForPerson: "{name}or lagi bodli photo",
  person: "Manuh",
  noFamiliarPeopleAdded: "Etiya kunu chinaki manuh jora nai.",
  showAllPeople: "Sob {count} jon dekhaibo",
};

Object.assign(caregiverDashboardEnglish, familiarPeopleManagerEnglish);
Object.assign(caregiverDashboardHindi, familiarPeopleManagerHindi);
Object.assign(caregiverDashboardTelugu, familiarPeopleManagerTelugu);
Object.assign(caregiverDashboardAssamese, familiarPeopleManagerAssamese);
Object.assign(caregiverDashboardBengali, familiarPeopleManagerBengali);
Object.assign(caregiverDashboardNagamese, familiarPeopleManagerNagamese);

const appHomeEnglish = {
  appHomeTitle: "Remember. Engage. Connect.", appHomeDescription: "A simple cognitive companion designed to help you stay engaged, remember daily activities, and stay connected.", patientGreeting: "Hi, {name}!", greetingFallbackName: "there", welcomeBackGoodDay: "Welcome back. Let's make today a good day.", patientCodeLabel: "Your patient code", patientCodeHelp: "Share this code with your caregiver to connect.", patientCodeUnavailable: "Patient code unavailable", cognitiveActivities: "Cognitive activities", memoryActivityShort: "Memory", activityShort: "Activity", attentionActivityShort: "Attention", dailyRoutineShort: "Daily routine", recallShort: "Recall", patternShort: "Pattern", recognitionShort: "Recognition", objectShort: "Object", wellbeingDailySupport: "Well-being & daily support", moodCheckIn: "Mood check-in", appElderConnect: "Elder Connect", appFamily: "Family", appFamiliarity: "Familiarity", healthcareWorkerPortal: "Healthcare Worker Portal", healthcareWorkerHomeDescription: "Review progress for patients explicitly assigned to your care. Patient data is read-only.", openHealthcareDashboard: "Open Healthcare Dashboard", healthcareDashboardDescription: "View authorized patient activity, trends, sessions, and permitted mood history.", signOutHealthcareAccount: "Sign out from your healthcare worker account.", caregiverHomeDescription: "Monitor patient activities, cognitive performance, progress, alerts, and recommendations.", openCaregiverDashboard: "Open Caregiver Dashboard", caregiverDashboardDescription: "View patient insights, performance trends and daily summaries.", connectPatientHome: "Connect Patient", connectPatientHomeDescription: "Enter patient code and send connection request.", managePatientRemindersHome: "Manage Patient Reminders", managePatientRemindersHomeDescription: "Create, edit and manage reminders for your patient.", signOutCaregiverAccount: "Sign out from your caregiver account.", manageCaregiverAndPatient: "Manage Caregiver & Patient",
};
const appHomeHindi = {
  appHomeTitle: "याद रखें। सक्रिय रहें। जुड़े रहें।", appHomeDescription: "एक सरल संज्ञानात्मक साथी, जो आपको सक्रिय रहने, दैनिक गतिविधियाँ याद रखने और जुड़े रहने में मदद करता है।", patientGreeting: "नमस्ते, {name}!", greetingFallbackName: "वहाँ", welcomeBackGoodDay: "फिर से स्वागत है। आइए आज का दिन अच्छा बनाएं।", patientCodeLabel: "आपका रोगी कोड", patientCodeHelp: "जुड़ने के लिए यह कोड अपने देखभालकर्ता के साथ साझा करें।", patientCodeUnavailable: "रोगी कोड उपलब्ध नहीं है", cognitiveActivities: "संज्ञानात्मक गतिविधियाँ", memoryActivityShort: "स्मृति", activityShort: "गतिविधि", attentionActivityShort: "ध्यान", dailyRoutineShort: "दैनिक दिनचर्या", recallShort: "याद करें", patternShort: "पैटर्न", recognitionShort: "पहचान", objectShort: "वस्तु", wellbeingDailySupport: "स्वस्थता और दैनिक सहायता", moodCheckIn: "मनोदशा जाँच", appElderConnect: "वरिष्ठ संपर्क", appFamily: "पारिवारिक", appFamiliarity: "परिचय", healthcareWorkerPortal: "स्वास्थ्यकर्मी पोर्टल", healthcareWorkerHomeDescription: "केवल आपकी देखभाल के लिए स्पष्ट रूप से सौंपे गए रोगियों की प्रगति देखें। रोगी डेटा केवल पढ़ने के लिए है।", openHealthcareDashboard: "स्वास्थ्यकर्मी डैशबोर्ड खोलें", healthcareDashboardDescription: "अधिकृत रोगी गतिविधि, रुझान, सत्र और अनुमत मनोदशा इतिहास देखें।", signOutHealthcareAccount: "अपने स्वास्थ्यकर्मी खाते से साइन आउट करें।", caregiverHomeDescription: "रोगी गतिविधियों, संज्ञानात्मक प्रदर्शन, प्रगति, चेतावनियों और सुझावों पर नज़र रखें।", openCaregiverDashboard: "देखभालकर्ता डैशबोर्ड खोलें", caregiverDashboardDescription: "रोगी की जानकारी, प्रदर्शन रुझान और दैनिक सारांश देखें।", connectPatientHome: "रोगी से जुड़ें", connectPatientHomeDescription: "रोगी कोड लिखें और कनेक्शन अनुरोध भेजें।", managePatientRemindersHome: "रोगी रिमाइंडर प्रबंधित करें", managePatientRemindersHomeDescription: "अपने रोगी के रिमाइंडर बनाएं, बदलें और प्रबंधित करें।", signOutCaregiverAccount: "अपने देखभालकर्ता खाते से साइन आउट करें।", manageCaregiverAndPatient: "देखभालकर्ता और रोगी प्रबंधित करें",
};
const appHomeTelugu = {
  appHomeTitle: "గుర్తుంచుకోండి. చురుకుగా ఉండండి. అనుసంధానంగా ఉండండి.", appHomeDescription: "మీరు చురుకుగా ఉండటానికి, రోజువారీ పనులను గుర్తుంచుకోవడానికి మరియు అనుసంధానంగా ఉండటానికి సహాయపడే సరళమైన జ్ఞాన సహచరుడు.", patientGreeting: "నమస్కారం, {name}!", greetingFallbackName: "అక్కడ", welcomeBackGoodDay: "మళ్లీ స్వాగతం. ఈ రోజును మంచి రోజుగా చేసుకుందాం.", patientCodeLabel: "మీ రోగి కోడ్", patientCodeHelp: "కనెక్ట్ కావడానికి ఈ కోడ్‌ను మీ సంరక్షకుడితో పంచుకోండి.", patientCodeUnavailable: "రోగి కోడ్ అందుబాటులో లేదు", cognitiveActivities: "జ్ఞాన కార్యకలాపాలు", memoryActivityShort: "జ్ఞాపకం", activityShort: "కార్యకలాపం", attentionActivityShort: "శ్రద్ధ", dailyRoutineShort: "రోజువారీ దినచర్య", recallShort: "గుర్తుచేసుకోండి", patternShort: "నమూనా", recognitionShort: "గుర్తింపు", objectShort: "వస్తువు", wellbeingDailySupport: "శ్రేయస్సు మరియు రోజువారీ సహాయం", moodCheckIn: "మానసిక స్థితి తనిఖీ", appElderConnect: "వృద్ధుల అనుసంధానం", appFamily: "కుటుంబ", appFamiliarity: "పరిచయం", healthcareWorkerPortal: "ఆరోగ్య కార్యకర్త పోర్టల్", healthcareWorkerHomeDescription: "మీ సంరక్షణకు స్పష్టంగా కేటాయించిన రోగుల పురోగతిని చూడండి. రోగి డేటా చదవడానికి మాత్రమే ఉంటుంది.", openHealthcareDashboard: "ఆరోగ్య కార్యకర్త డ్యాష్‌బోర్డ్ తెరవండి", healthcareDashboardDescription: "అనుమతించిన రోగి కార్యకలాపాలు, ధోరణులు, సెషన్‌లు మరియు అనుమతించిన మానసిక స్థితి చరిత్రను చూడండి.", signOutHealthcareAccount: "మీ ఆరోగ్య కార్యకర్త ఖాతా నుండి సైన్ అవుట్ చేయండి.", caregiverHomeDescription: "రోగి కార్యకలాపాలు, జ్ఞాన పనితీరు, పురోగతి, హెచ్చరికలు మరియు సూచనలను గమనించండి.", openCaregiverDashboard: "సంరక్షకుడి డ్యాష్‌బోర్డ్ తెరవండి", caregiverDashboardDescription: "రోగి వివరాలు, పనితీరు ధోరణులు మరియు రోజువారీ సారాంశాలను చూడండి.", connectPatientHome: "రోగితో అనుసంధానమవండి", connectPatientHomeDescription: "రోగి కోడ్ నమోదు చేసి కనెక్షన్ అభ్యర్థన పంపండి.", managePatientRemindersHome: "రోగి గుర్తుచూపులను నిర్వహించండి", managePatientRemindersHomeDescription: "మీ రోగి గుర్తుచూపులను సృష్టించండి, సవరించండి మరియు నిర్వహించండి.", signOutCaregiverAccount: "మీ సంరక్షకుడి ఖాతా నుండి సైన్ అవుట్ చేయండి.", manageCaregiverAndPatient: "సంరక్షకుడు మరియు రోగిని నిర్వహించండి",
};
const appHomeAssamese = {
  appHomeTitle: "মনত ৰাখক। সক্ৰিয় থাকক। সংযুক্ত থাকক।", appHomeDescription: "আপোনাক সক্ৰিয় থাকিবলৈ, দৈনন্দিন কাম মনত ৰাখিবলৈ আৰু সংযুক্ত হৈ থাকিবলৈ সহায় কৰা এটা সহজ জ্ঞানীয় সঙ্গী।", patientGreeting: "নমস্কাৰ, {name}!", greetingFallbackName: "তাত", welcomeBackGoodDay: "আকৌ স্বাগতম। আহক, আজিৰ দিনটো ভাল কৰি তোলোঁ।", patientCodeLabel: "আপোনাৰ ৰোগী কোড", patientCodeHelp: "সংযোগ কৰিবলৈ এই কোডটো আপোনাৰ যত্নদাতাৰ সৈতে ভাগ-বতৰা কৰক।", patientCodeUnavailable: "ৰোগী কোড উপলব্ধ নহয়", cognitiveActivities: "জ্ঞানীয় কাৰ্যকলাপ", memoryActivityShort: "স্মৃতি", activityShort: "কাৰ্যকলাপ", attentionActivityShort: "মনোযোগ", dailyRoutineShort: "দৈনন্দিন দিনচৰ্যা", recallShort: "মনত পেলাওক", patternShort: "নমুনা", recognitionShort: "চিনাক্তকৰণ", objectShort: "বস্তু", wellbeingDailySupport: "সুস্থতা আৰু দৈনন্দিন সহায়", moodCheckIn: "মনোভাৱ পৰীক্ষা", appElderConnect: "জ্যেষ্ঠ সংযোগ", appFamily: "পৰিয়ালৰ", appFamiliarity: "চিনাকি", healthcareWorkerPortal: "স্বাস্থ্যকৰ্মী প'ৰ্টেল", healthcareWorkerHomeDescription: "কেৱল আপোনাৰ যত্নৰ বাবে স্পষ্টভাৱে নিযুক্ত ৰোগীসকলৰ অগ্ৰগতি চাওক। ৰোগীৰ তথ্য কেৱল পঢ়িবৰ বাবে।", openHealthcareDashboard: "স্বাস্থ্যকৰ্মী ডেশ্বব'ৰ্ড খোলক", healthcareDashboardDescription: "অনুমোদিত ৰোগী কাৰ্যকলাপ, প্ৰৱণতা, অধিৱেশন আৰু অনুমোদিত মনোভাৱৰ ইতিহাস চাওক।", signOutHealthcareAccount: "আপোনাৰ স্বাস্থ্যকৰ্মী একাউণ্টৰ পৰা ছাইন আউট কৰক।", caregiverHomeDescription: "ৰোগীৰ কাৰ্যকলাপ, জ্ঞানীয় প্ৰদৰ্শন, অগ্ৰগতি, সতৰ্কতা আৰু পৰামৰ্শ নিৰীক্ষণ কৰক।", openCaregiverDashboard: "যত্নদাতা ডেশ্বব'ৰ্ড খোলক", caregiverDashboardDescription: "ৰোগীৰ তথ্য, প্ৰদৰ্শনৰ প্ৰৱণতা আৰু দৈনিক সাৰাংশ চাওক।", connectPatientHome: "ৰোগীৰ সৈতে সংযোগ কৰক", connectPatientHomeDescription: "ৰোগী কোড লিখি সংযোগ অনুৰোধ পঠাওক।", managePatientRemindersHome: "ৰোগীৰ সোঁৱৰণী পৰিচালনা কৰক", managePatientRemindersHomeDescription: "আপোনাৰ ৰোগীৰ সোঁৱৰণী সৃষ্টি, সম্পাদনা আৰু পৰিচালনা কৰক।", signOutCaregiverAccount: "আপোনাৰ যত্নদাতা একাউণ্টৰ পৰা ছাইন আউট কৰক।", manageCaregiverAndPatient: "যত্নদাতা আৰু ৰোগী পৰিচালনা কৰক",
};
const appHomeBengali = {
  appHomeTitle: "মনে রাখুন। সক্রিয় থাকুন। সংযুক্ত থাকুন।", appHomeDescription: "সক্রিয় থাকতে, প্রতিদিনের কাজ মনে রাখতে এবং সংযুক্ত থাকতে সহায়তা করার জন্য একটি সহজ জ্ঞানীয় সঙ্গী।", patientGreeting: "নমস্কার, {name}!", greetingFallbackName: "সেখানে", welcomeBackGoodDay: "আবার স্বাগতম। আজকের দিনটি সুন্দর করি।", patientCodeLabel: "আপনার রোগী কোড", patientCodeHelp: "সংযোগ করতে এই কোডটি আপনার যত্নদাতার সঙ্গে ভাগ করুন।", patientCodeUnavailable: "রোগী কোড পাওয়া যাচ্ছে না", cognitiveActivities: "জ্ঞানীয় কার্যক্রম", memoryActivityShort: "স্মৃতি", activityShort: "কার্যক্রম", attentionActivityShort: "মনোযোগ", dailyRoutineShort: "দৈনিক রুটিন", recallShort: "মনে করুন", patternShort: "প্যাটার্ন", recognitionShort: "শনাক্তকরণ", objectShort: "বস্তু", wellbeingDailySupport: "সুস্থতা ও দৈনন্দিন সহায়তা", moodCheckIn: "মেজাজ পরীক্ষা", appElderConnect: "প্রবীণ সংযোগ", appFamily: "পারিবারিক", appFamiliarity: "পরিচিতি", healthcareWorkerPortal: "স্বাস্থ্যকর্মী পোর্টাল", healthcareWorkerHomeDescription: "শুধু আপনার যত্নের জন্য নির্দিষ্ট রোগীদের অগ্রগতি দেখুন। রোগীর তথ্য শুধু পড়ার জন্য।", openHealthcareDashboard: "স্বাস্থ্যকর্মী ড্যাশবোর্ড খুলুন", healthcareDashboardDescription: "অনুমোদিত রোগীর কার্যক্রম, প্রবণতা, সেশন এবং অনুমোদিত মেজাজের ইতিহাস দেখুন।", signOutHealthcareAccount: "আপনার স্বাস্থ্যকর্মী অ্যাকাউন্ট থেকে সাইন আউট করুন।", caregiverHomeDescription: "রোগীর কার্যক্রম, জ্ঞানীয় কর্মদক্ষতা, অগ্রগতি, সতর্কতা ও পরামর্শ পর্যবেক্ষণ করুন।", openCaregiverDashboard: "যত্নদাতা ড্যাশবোর্ড খুলুন", caregiverDashboardDescription: "রোগীর তথ্য, কর্মদক্ষতার প্রবণতা এবং দৈনিক সারাংশ দেখুন।", connectPatientHome: "রোগীর সঙ্গে সংযোগ করুন", connectPatientHomeDescription: "রোগী কোড লিখে সংযোগের অনুরোধ পাঠান।", managePatientRemindersHome: "রোগীর স্মরণিকা পরিচালনা করুন", managePatientRemindersHomeDescription: "আপনার রোগীর স্মরণিকা তৈরি, সম্পাদনা ও পরিচালনা করুন।", signOutCaregiverAccount: "আপনার যত্নদাতা অ্যাকাউন্ট থেকে সাইন আউট করুন।", manageCaregiverAndPatient: "যত্নদাতা ও রোগী পরিচালনা করুন",
};
const appHomeNagamese = {
  appHomeTitle: "Monot rakhibo. Active thakibo. Jogajogot thakibo.", appHomeDescription: "Apunak active thakibole, roj kaam monot rakhibole aru connected thakibole help kora ek sahaj monor logor manu.", patientGreeting: "Namaskar, {name}!", greetingFallbackName: "tat", welcomeBackGoodDay: "Aru ekbar swagat. Aji din tu bhal koribo.", patientCodeLabel: "Apunar patient code", patientCodeHelp: "Connect koribole ei code tu apunar caregiver logot share koribo.", patientCodeUnavailable: "Patient code available nai", cognitiveActivities: "Monor kaam", memoryActivityShort: "Monot rakhibo", activityShort: "Kaam", attentionActivityShort: "Monojag", dailyRoutineShort: "Roj routine", recallShort: "Monot anibo", patternShort: "Patternor chinaki", recognitionShort: "Chinibo", objectShort: "Bostu", wellbeingDailySupport: "Bhal thaka aru roj support", moodCheckIn: "Mood check", appElderConnect: "Bura manuhor jogajog", appFamily: "Poriyalor", appFamiliarity: "Chinaki", healthcareWorkerPortal: "Health worker portal", healthcareWorkerHomeDescription: "Apunar care lagi thik pora diya patient khanor progress sabo. Patient data kebol porhibole.", openHealthcareDashboard: "Health worker dashboard khulibo", healthcareDashboardDescription: "Allowed patient activity, trend, session aru mood history sabo.", signOutHealthcareAccount: "Apunar health worker account pora sign out koribo.", caregiverHomeDescription: "Patient activity, monor performance, progress, alert aru suggestion monitor koribo.", openCaregiverDashboard: "Caregiver dashboard khulibo", caregiverDashboardDescription: "Patient insight, performance trend aru daily summary sabo.", connectPatientHome: "Patient logot connect koribo", connectPatientHomeDescription: "Patient code dibo aru connection request pathabo.", managePatientRemindersHome: "Patient reminder manage koribo", managePatientRemindersHomeDescription: "Apunar patient reminder bonabo, edit koribo aru manage koribo.", signOutCaregiverAccount: "Apunar caregiver account pora sign out koribo.", manageCaregiverAndPatient: "Caregiver aru patient manage koribo",
};
Object.assign(english, appHomeEnglish);
Object.assign(hindi, appHomeHindi);
Object.assign(telugu, appHomeTelugu);
Object.assign(assamese, appHomeAssamese);
Object.assign(bengali, appHomeBengali);
Object.assign(nagamese, appHomeNagamese);

const dailyCarePlanEnglish = {
  dailyCarePlanHeading: "Daily Care Plan",
  todaysCarePlan: "Today's Care Plan",
  todaysFocus: "Today's focus:",
  todaysMoodCheckComplete: "Today's mood check is complete.",
  completeTodaysMoodCheck: "Complete today's mood check.",
  recommendedFromRecentActivity: "Recommended from your recent activity.",
  markComplete: "Mark complete",
  loadingDailyCarePlan: "Loading today's care plan…",
  unableToLoadDailyCarePlan: "Unable to load today's care plan.",
  unableToCompleteDailyCarePlanItem: "Unable to complete care plan item.",
  memoryActivityName: "Memory Activity",
  attentionActivityName: "Attention Activity",
  dailyRoutineRecallActivityName: "Daily Routine Recall",
  patternRecognitionActivityName: "Pattern Recognition",
  objectRecognitionActivityName: "Object Recognition",
};
const dailyCarePlanHindi = {
  dailyCarePlanHeading: "दैनिक देखभाल योजना",
  todaysCarePlan: "आज की देखभाल योजना",
  todaysFocus: "आज का मुख्य ध्यान:",
  todaysMoodCheckComplete: "आज की मनोदशा जाँच पूरी हो गई है।",
  completeTodaysMoodCheck: "आज की मनोदशा जाँच पूरी करें।",
  recommendedFromRecentActivity: "आपकी हाल की गतिविधि के आधार पर सुझाव।",
  markComplete: "पूरा करें",
  loadingDailyCarePlan: "आज की देखभाल योजना लोड हो रही है…",
  unableToLoadDailyCarePlan: "आज की देखभाल योजना लोड नहीं हो सकी।",
  unableToCompleteDailyCarePlanItem: "देखभाल योजना का कार्य पूरा नहीं हो सका।",
  memoryActivityName: "स्मृति गतिविधि",
  attentionActivityName: "ध्यान गतिविधि",
  dailyRoutineRecallActivityName: "दैनिक दिनचर्या याद",
  patternRecognitionActivityName: "पैटर्न पहचान",
  objectRecognitionActivityName: "वस्तु पहचान",
};
const dailyCarePlanTelugu = {
  dailyCarePlanHeading: "రోజువారీ సంరక్షణ ప్రణాళిక",
  todaysCarePlan: "నేటి సంరక్షణ ప్రణాళిక",
  todaysFocus: "నేటి ప్రధాన దృష్టి:",
  todaysMoodCheckComplete: "నేటి మానసిక స్థితి తనిఖీ పూర్తైంది.",
  completeTodaysMoodCheck: "నేటి మానసిక స్థితి తనిఖీని పూర్తి చేయండి.",
  recommendedFromRecentActivity: "మీ ఇటీవలి కార్యకలాపం ఆధారంగా సూచించబడింది.",
  markComplete: "పూర్తయినట్లు గుర్తించండి",
  loadingDailyCarePlan: "నేటి సంరక్షణ ప్రణాళిక లోడ్ అవుతోంది…",
  unableToLoadDailyCarePlan: "నేటి సంరక్షణ ప్రణాళికను లోడ్ చేయలేకపోయాము.",
  unableToCompleteDailyCarePlanItem: "సంరక్షణ ప్రణాళిక అంశాన్ని పూర్తి చేయలేకపోయాము.",
  memoryActivityName: "జ్ఞాపకశక్తి కార్యకలాపం",
  attentionActivityName: "శ్రద్ధ కార్యకలాపం",
  dailyRoutineRecallActivityName: "రోజువారీ దినచర్య గుర్తింపు",
  patternRecognitionActivityName: "నమూనా గుర్తింపు",
  objectRecognitionActivityName: "వస్తు గుర్తింపు",
};
const dailyCarePlanAssamese = {
  dailyCarePlanHeading: "দৈনিক যত্ন পৰিকল্পনা",
  todaysCarePlan: "আজিৰ যত্ন পৰিকল্পনা",
  todaysFocus: "আজিৰ মূল লক্ষ্য:",
  todaysMoodCheckComplete: "আজিৰ মনোভাৱ পৰীক্ষা সম্পূৰ্ণ হৈছে।",
  completeTodaysMoodCheck: "আজিৰ মনোভাৱ পৰীক্ষা সম্পূৰ্ণ কৰক।",
  recommendedFromRecentActivity: "আপোনাৰ শেহতীয়া কাৰ্যকলাপৰ ভিত্তিত পৰামৰ্শ।",
  markComplete: "সম্পূৰ্ণ কৰক",
  loadingDailyCarePlan: "আজিৰ যত্ন পৰিকল্পনা লোড হৈছে…",
  unableToLoadDailyCarePlan: "আজিৰ যত্ন পৰিকল্পনা লোড কৰিব নোৱাৰিলে।",
  unableToCompleteDailyCarePlanItem: "যত্ন পৰিকল্পনাৰ কামটো সম্পূৰ্ণ কৰিব নোৱাৰিলে।",
  memoryActivityName: "স্মৃতি কাৰ্যকলাপ",
  attentionActivityName: "মনোযোগ কাৰ্যকলাপ",
  dailyRoutineRecallActivityName: "দৈনিক দিনচৰ্যা মনত পেলোৱা",
  patternRecognitionActivityName: "নমুনা চিনাক্তকৰণ",
  objectRecognitionActivityName: "বস্তু চিনাক্তকৰণ",
};
const dailyCarePlanBengali = {
  dailyCarePlanHeading: "দৈনিক যত্ন পরিকল্পনা",
  todaysCarePlan: "আজকের যত্ন পরিকল্পনা",
  todaysFocus: "আজকের প্রধান লক্ষ্য:",
  todaysMoodCheckComplete: "আজকের মেজাজ পরীক্ষা সম্পন্ন হয়েছে।",
  completeTodaysMoodCheck: "আজকের মেজাজ পরীক্ষা সম্পন্ন করুন।",
  recommendedFromRecentActivity: "আপনার সাম্প্রতিক কার্যকলাপের ভিত্তিতে পরামর্শ।",
  markComplete: "সম্পন্ন করুন",
  loadingDailyCarePlan: "আজকের যত্ন পরিকল্পনা লোড হচ্ছে…",
  unableToLoadDailyCarePlan: "আজকের যত্ন পরিকল্পনা লোড করা যায়নি।",
  unableToCompleteDailyCarePlanItem: "যত্ন পরিকল্পনার কাজটি সম্পন্ন করা যায়নি।",
  memoryActivityName: "স্মৃতি কার্যক্রম",
  attentionActivityName: "মনোযোগ কার্যক্রম",
  dailyRoutineRecallActivityName: "দৈনিক রুটিন স্মরণ",
  patternRecognitionActivityName: "প্যাটার্ন শনাক্তকরণ",
  objectRecognitionActivityName: "বস্তু শনাক্তকরণ",
};
const dailyCarePlanNagamese = {
  dailyCarePlanHeading: "Roj care plan",
  todaysCarePlan: "Ajir care plan",
  todaysFocus: "Ajir main focus:",
  todaysMoodCheckComplete: "Ajir mood check complete hoi ase.",
  completeTodaysMoodCheck: "Ajir mood check complete koribo.",
  recommendedFromRecentActivity: "Apunar recent kaam hisab te suggestion.",
  markComplete: "Complete kori dibo",
  loadingDailyCarePlan: "Ajir care plan load hoi ase…",
  unableToLoadDailyCarePlan: "Ajir care plan load hobo nai.",
  unableToCompleteDailyCarePlanItem: "Care planor kaam complete hobo nai.",
  memoryActivityName: "Monot rakha kaam",
  attentionActivityName: "Mon dibo kaam",
  dailyRoutineRecallActivityName: "Rojor routine monot anibo",
  patternRecognitionActivityName: "Pattern chinibo",
  objectRecognitionActivityName: "Bostu chinibo",
};
Object.assign(english, dailyCarePlanEnglish);
Object.assign(hindi, dailyCarePlanHindi);
Object.assign(telugu, dailyCarePlanTelugu);
Object.assign(assamese, dailyCarePlanAssamese);
Object.assign(bengali, dailyCarePlanBengali);
Object.assign(nagamese, dailyCarePlanNagamese);

const elderMessagesEnglish = {
  allowMicrophoneInSettings: "Allow microphone access in Android Settings, then try again.",
  recordingUnavailableInBrowser: "Recording is not available in this browser.",
  unableToStartVoiceRecording: "Unable to start voice recording.",
  unableToSaveVoiceRecording: "Unable to save voice recording. Please record for at least one second.",
  unableToPlayVoiceMessage: "Unable to play this voice message.",
};
const elderMessagesHindi = {
  allowMicrophoneInSettings: "Android सेटिंग्स में माइक्रोफ़ोन की अनुमति दें, फिर दोबारा कोशिश करें।",
  recordingUnavailableInBrowser: "इस ब्राउज़र में रिकॉर्डिंग उपलब्ध नहीं है।",
  unableToStartVoiceRecording: "वॉइस संदेश रिकॉर्ड करना शुरू नहीं हो सका।",
  unableToSaveVoiceRecording: "वॉइस संदेश सहेजा नहीं जा सका। कृपया कम से कम एक सेकंड रिकॉर्ड करें।",
  unableToPlayVoiceMessage: "यह वॉइस संदेश चलाया नहीं जा सका।",
};
const elderMessagesTelugu = {
  allowMicrophoneInSettings: "Android సెట్టింగ్‌లలో మైక్రోఫోన్ అనుమతిని ఇవ్వండి, తర్వాత మళ్లీ ప్రయత్నించండి.",
  recordingUnavailableInBrowser: "ఈ బ్రౌజర్‌లో రికార్డింగ్ అందుబాటులో లేదు.",
  unableToStartVoiceRecording: "వాయిస్ సందేశ రికార్డింగ్‌ను ప్రారంభించలేకపోయాము.",
  unableToSaveVoiceRecording: "వాయిస్ సందేశాన్ని సేవ్ చేయలేకపోయాము. కనీసం ఒక సెకను రికార్డ్ చేయండి.",
  unableToPlayVoiceMessage: "ఈ వాయిస్ సందేశాన్ని ప్లే చేయలేకపోయాము.",
};
const elderMessagesAssamese = {
  allowMicrophoneInSettings: "Android ছেটিংছত মাইক্ৰ'ফোনৰ অনুমতি দিয়ক, তাৰ পিছত আকৌ চেষ্টা কৰক।",
  recordingUnavailableInBrowser: "এই ব্ৰাউজাৰত ৰেকৰ্ডিং উপলব্ধ নহয়।",
  unableToStartVoiceRecording: "কণ্ঠ বাৰ্তা ৰেকৰ্ডিং আৰম্ভ কৰিব নোৱাৰিলে।",
  unableToSaveVoiceRecording: "কণ্ঠ বাৰ্তা সংৰক্ষণ কৰিব নোৱাৰিলে। অনুগ্ৰহ কৰি কমেও এক ছেকেণ্ড ৰেকৰ্ড কৰক।",
  unableToPlayVoiceMessage: "এই কণ্ঠ বাৰ্তাটো চলাব নোৱাৰিলে।",
};
const elderMessagesBengali = {
  allowMicrophoneInSettings: "Android সেটিংসে মাইক্রোফোনের অনুমতি দিন, তারপর আবার চেষ্টা করুন।",
  recordingUnavailableInBrowser: "এই ব্রাউজারে রেকর্ডিং উপলব্ধ নয়।",
  unableToStartVoiceRecording: "ভয়েস বার্তা রেকর্ড করা শুরু করা যায়নি।",
  unableToSaveVoiceRecording: "ভয়েস বার্তা সংরক্ষণ করা যায়নি। অনুগ্রহ করে অন্তত এক সেকেন্ড রেকর্ড করুন।",
  unableToPlayVoiceMessage: "এই ভয়েস বার্তাটি চালানো যায়নি।",
};
const elderMessagesNagamese = {
  allowMicrophoneInSettings: "Android Settings te microphone permission dibo, piche aru ekbar try koribo.",
  recordingUnavailableInBrowser: "Ei browser te recording available nai.",
  unableToStartVoiceRecording: "Voice message record shuru hobo nai.",
  unableToSaveVoiceRecording: "Voice message save hobo nai. Kom se kom ek second record koribo.",
  unableToPlayVoiceMessage: "Ei voice message play hobo nai.",
};
Object.assign(english, elderMessagesEnglish);
Object.assign(hindi, elderMessagesHindi);
Object.assign(telugu, elderMessagesTelugu);
Object.assign(assamese, elderMessagesAssamese);
Object.assign(bengali, elderMessagesBengali);
Object.assign(nagamese, elderMessagesNagamese);

const caregiverRequestsEnglish = {
  connectionRequestCount: "Connection requests ({count})",
  failedToLoadConnectionRequests: "Failed to load connection requests.",
  failedToProcessConnectionRequest: "Failed to process connection request.",
};
const caregiverRequestsHindi = {
  connectionRequestCount: "कनेक्शन अनुरोध ({count})",
  failedToLoadConnectionRequests: "कनेक्शन अनुरोध लोड नहीं हो सके।",
  failedToProcessConnectionRequest: "कनेक्शन अनुरोध पूरा नहीं हो सका।",
};
const caregiverRequestsTelugu = {
  connectionRequestCount: "కనెక్షన్ అభ్యర్థనలు ({count})",
  failedToLoadConnectionRequests: "కనెక్షన్ అభ్యర్థనలను లోడ్ చేయలేకపోయాము.",
  failedToProcessConnectionRequest: "కనెక్షన్ అభ్యర్థనను పూర్తి చేయలేకపోయాము.",
};
const caregiverRequestsAssamese = {
  connectionRequestCount: "সংযোগ অনুৰোধসমূহ ({count})",
  failedToLoadConnectionRequests: "সংযোগ অনুৰোধসমূহ লোড কৰিব নোৱাৰিলে।",
  failedToProcessConnectionRequest: "সংযোগ অনুৰোধটো সম্পূৰ্ণ কৰিব নোৱাৰিলে।",
};
const caregiverRequestsBengali = {
  connectionRequestCount: "সংযোগের অনুরোধগুলি ({count})",
  failedToLoadConnectionRequests: "সংযোগের অনুরোধগুলি লোড করা যায়নি।",
  failedToProcessConnectionRequest: "সংযোগের অনুরোধটি সম্পন্ন করা যায়নি।",
};
const caregiverRequestsNagamese = {
  connectionRequestCount: "Connection request khan ({count})",
  failedToLoadConnectionRequests: "Connection request khan load hobo nai.",
  failedToProcessConnectionRequest: "Connection request pura hobo nai.",
};
Object.assign(english, caregiverRequestsEnglish);
Object.assign(hindi, caregiverRequestsHindi);
Object.assign(telugu, caregiverRequestsTelugu);
Object.assign(assamese, caregiverRequestsAssamese);
Object.assign(bengali, caregiverRequestsBengali);
Object.assign(nagamese, caregiverRequestsNagamese);

const memoryGameEnglish = {
  memoryGameEyebrow: "Memory Activity", memoryGameTitle: "Find the matching pairs",
  memoryGameDescription: "Take your time. Turn over two cards and try to remember where each picture is.",
  moves: "Moves", memoryGameProgress: "Game progress", pairsFound: "Pairs found", pairsProgress: "{found} of {total}", turnsTaken: "Turns taken", activityLevel: "Activity level",
  memoryGameTip: "Choose one card, then choose another card to look for its match.", matchedCard: "Matched card", selectedCard: "Selected card", faceDownCard: "Face-down card",
  wonderful: "Wonderful!", savingProgress: "Saving your progress…", playAgain: "Play again",
  foundAllPairsInMoves: "You found all the pairs in {moves} moves.", gameSavedOffline: "Game saved offline. It will sync when internet returns.",
  progressSaved: "Your progress has been saved.", gameCompletedProgressNotSaved: "Game completed, but progress could not be saved.",
};
const memoryGameHindi = {
  memoryGameEyebrow: "स्मृति गतिविधि", memoryGameTitle: "मिलते-जुलते जोड़े खोजें",
  memoryGameDescription: "आराम से खेलें। दो कार्ड पलटें और याद रखने की कोशिश करें कि हर चित्र कहाँ है।",
  moves: "चालें", memoryGameProgress: "खेल की प्रगति", pairsFound: "मिले हुए जोड़े", pairsProgress: "कुल {total} में से {found}", turnsTaken: "ली गई चालें", activityLevel: "गतिविधि स्तर",
  memoryGameTip: "एक कार्ड चुनें, फिर उसका जोड़ा ढूँढ़ने के लिए दूसरा कार्ड चुनें।", matchedCard: "मिलान किया हुआ कार्ड", selectedCard: "चुना गया कार्ड", faceDownCard: "बंद कार्ड",
  wonderful: "बहुत बढ़िया!", savingProgress: "आपकी प्रगति सहेजी जा रही है…", playAgain: "फिर से खेलें",
  foundAllPairsInMoves: "आपने सभी जोड़े {moves} चालों में ढूँढ़ लिए।", gameSavedOffline: "खेल ऑफ़लाइन सहेज लिया गया है। इंटरनेट आने पर यह सिंक हो जाएगा।",
  progressSaved: "आपकी प्रगति सहेज ली गई है।", gameCompletedProgressNotSaved: "खेल पूरा हुआ, लेकिन प्रगति सहेजी नहीं जा सकी।",
};
const memoryGameTelugu = {
  memoryGameEyebrow: "జ్ఞాపకశక్తి కార్యకలాపం", memoryGameTitle: "సరిపోయే జతలను కనుగొనండి",
  memoryGameDescription: "నెమ్మదిగా ఆడండి. రెండు కార్డులను తిప్పి, ప్రతి చిత్రం ఎక్కడ ఉందో గుర్తుంచుకోవడానికి ప్రయత్నించండి.",
  moves: "చలనాలు", memoryGameProgress: "ఆట పురోగతి", pairsFound: "కనుగొన్న జతలు", pairsProgress: "మొత్తం {total}లో {found}", turnsTaken: "తీసుకున్న చలనాలు", activityLevel: "కార్యకలాప స్థాయి",
  memoryGameTip: "ఒక కార్డును ఎంచుకుని, దాని జతను కనుగొనడానికి మరో కార్డును ఎంచుకోండి.", matchedCard: "సరిపోయిన కార్డు", selectedCard: "ఎంచుకున్న కార్డు", faceDownCard: "మూసి ఉన్న కార్డు",
  wonderful: "చాలా బాగా చేశారు!", savingProgress: "మీ పురోగతి సేవ్ అవుతోంది…", playAgain: "మళ్లీ ఆడండి",
  foundAllPairsInMoves: "మీరు అన్ని జతలను {moves} చలనాల్లో కనుగొన్నారు.", gameSavedOffline: "ఆట ఆఫ్‌లైన్‌లో సేవ్ అయింది. ఇంటర్నెట్ వచ్చినప్పుడు సమకాలీకరించబడుతుంది.",
  progressSaved: "మీ పురోగతి సేవ్ అయింది.", gameCompletedProgressNotSaved: "ఆట పూర్తైంది, కానీ పురోగతిని సేవ్ చేయలేకపోయాము.",
};
const memoryGameAssamese = {
  memoryGameEyebrow: "স্মৃতি কাৰ্যকলাপ", memoryGameTitle: "মিল থকা যোৰবোৰ বিচাৰি উলিয়াওক",
  memoryGameDescription: "ধীৰে ধীৰে খেলক। দুখন কাৰ্ড উলটাই প্ৰতিখন ছবি ক'ত আছে মনত ৰাখিবলৈ চেষ্টা কৰক।",
  moves: "চাল", memoryGameProgress: "খেলৰ অগ্ৰগতি", pairsFound: "পোৱা যোৰ", pairsProgress: "মুঠ {total}ৰ ভিতৰত {found}", turnsTaken: "লোৱা চাল", activityLevel: "কাৰ্যকলাপৰ স্তৰ",
  memoryGameTip: "এখন কাৰ্ড বাছক, তাৰ পিছত মিল বিচাৰিবলৈ আন এখন কাৰ্ড বাছক।", matchedCard: "মিল থকা কাৰ্ড", selectedCard: "বাছনি কৰা কাৰ্ড", faceDownCard: "বন্ধ কাৰ্ড",
  wonderful: "খুব ভাল!", savingProgress: "আপোনাৰ অগ্ৰগতি সংৰক্ষণ হৈ আছে…", playAgain: "আকৌ খেলক",
  foundAllPairsInMoves: "আপুনি সকলো যোৰ {moves} চালত বিচাৰি উলিয়ালে।", gameSavedOffline: "খেল অফলাইনত সংৰক্ষণ কৰা হ'ল। ইণ্টাৰনেট ঘূৰি আহিলে ছিংক হ'ব।",
  progressSaved: "আপোনাৰ অগ্ৰগতি সংৰক্ষণ কৰা হ'ল।", gameCompletedProgressNotSaved: "খেল সম্পূৰ্ণ হ'ল, কিন্তু অগ্ৰগতি সংৰক্ষণ কৰিব নোৱাৰিলে।",
};
const memoryGameBengali = {
  memoryGameEyebrow: "স্মৃতি কার্যক্রম", memoryGameTitle: "মিল খুঁজে জোড়া তৈরি করুন",
  memoryGameDescription: "ধীরে ধীরে খেলুন। দুটি কার্ড উল্টে দেখুন এবং প্রতিটি ছবি কোথায় আছে মনে রাখার চেষ্টা করুন।",
  moves: "চাল", memoryGameProgress: "খেলার অগ্রগতি", pairsFound: "পাওয়া জোড়া", pairsProgress: "মোট {total} এর মধ্যে {found}", turnsTaken: "নেওয়া চাল", activityLevel: "কার্যক্রমের স্তর",
  memoryGameTip: "একটি কার্ড বেছে নিন, তারপর তার মিল খুঁজতে আরেকটি কার্ড বেছে নিন।", matchedCard: "মিলেছে এমন কার্ড", selectedCard: "নির্বাচিত কার্ড", faceDownCard: "বন্ধ কার্ড",
  wonderful: "খুব ভালো!", savingProgress: "আপনার অগ্রগতি সংরক্ষণ হচ্ছে…", playAgain: "আবার খেলুন",
  foundAllPairsInMoves: "আপনি সব জোড়া {moves} চালে খুঁজে পেয়েছেন।", gameSavedOffline: "খেলাটি অফলাইনে সংরক্ষণ করা হয়েছে। ইন্টারনেট ফিরলে এটি সিঙ্ক হবে।",
  progressSaved: "আপনার অগ্রগতি সংরক্ষণ করা হয়েছে।", gameCompletedProgressNotSaved: "খেলা সম্পন্ন হয়েছে, কিন্তু অগ্রগতি সংরক্ষণ করা যায়নি।",
};
const memoryGameNagamese = {
  memoryGameEyebrow: "Memory activity", memoryGameTitle: "Mil thaka jora bisari ulabo",
  memoryGameDescription: "Lahai lahai khelibo. Duta card ulatai aru sob picture kot ase monot rakhibo try koribo.",
  moves: "Chal", memoryGameProgress: "Gameor agor gati", pairsFound: "Puwa jora", pairsProgress: "Muth {total} pora {found}", turnsTaken: "Lua chal", activityLevel: "Kaamor level",
  memoryGameTip: "Ekta card bachibo, pichete mil bisaribole aru ekta card bachibo.", matchedCard: "Mil card", selectedCard: "Bacha card", faceDownCard: "Bondho card",
  wonderful: "Besi bhal!", savingProgress: "Apunar progress save hoi ase…", playAgain: "Abar khelibo",
  foundAllPairsInMoves: "Apuni sob jora {moves} chal te bisari paishe.", gameSavedOffline: "Game offline save hoise. Internet ahile sync hobo.",
  progressSaved: "Apunar progress save hoise.", gameCompletedProgressNotSaved: "Game complete hoise, kintu progress save hobo nai.",
};
Object.assign(english, memoryGameEnglish);
Object.assign(hindi, memoryGameHindi);
Object.assign(telugu, memoryGameTelugu);
Object.assign(assamese, memoryGameAssamese);
Object.assign(bengali, memoryGameBengali);
Object.assign(nagamese, memoryGameNagamese);

const attentionGameEnglish = {
  attentionGameEyebrow: "Attention Activity", attentionGameTitle: "Focus on the target",
  attentionGameDescription: "Look at the target symbol and select it as quickly and accurately as you can.",
  round: "Round", timeRemaining: "Time remaining", attentionGameTip: "Find the same symbol shown in the target box below.",
  targetLabel: "Target", secondsRemaining: "seconds remaining", chooseSymbol: "Choose this symbol", attentionGameProgress: "Game progress",
  attentionGameSummary: "Round {round} • Level {level} • Time: {time}s", attentionRoundProgress: "{current} of {total}",
  correctAnswers: "Correct answers", wellDone: "Well done!", attentionCompletedAt: "Completed at level {level}",
  answeredCorrectly: "You answered {correct} out of {total} correctly.", activityCompletedProgressNotSaved: "Activity completed, but progress could not be saved.",
};
const attentionGameHindi = {
  attentionGameEyebrow: "ध्यान गतिविधि", attentionGameTitle: "लक्ष्य पर ध्यान दें",
  attentionGameDescription: "लक्ष्य चिन्ह को देखें और उसे जितना जल्दी व सही हो सके चुनें।",
  round: "दौर", timeRemaining: "शेष समय", attentionGameTip: "नीचे लक्ष्य बॉक्स में दिखा वही चिन्ह खोजें।",
  targetLabel: "लक्ष्य", secondsRemaining: "सेकंड शेष", chooseSymbol: "यह चिन्ह चुनें", attentionGameProgress: "खेल की प्रगति",
  attentionGameSummary: "दौर {round} • स्तर {level} • समय: {time} सेकंड", attentionRoundProgress: "कुल {total} में से {current}",
  correctAnswers: "सही उत्तर", wellDone: "बहुत अच्छा!", attentionCompletedAt: "स्तर {level} पर पूरा हुआ",
  answeredCorrectly: "आपने {total} में से {correct} सही उत्तर दिए।", activityCompletedProgressNotSaved: "गतिविधि पूरी हुई, लेकिन प्रगति सहेजी नहीं जा सकी।",
};
const attentionGameTelugu = {
  attentionGameEyebrow: "శ్రద్ధ కార్యకలాపం", attentionGameTitle: "లక్ష్యంపై దృష్టి పెట్టండి",
  attentionGameDescription: "లక్ష్య చిహ్నాన్ని చూసి, వీలైనంత త్వరగా మరియు సరిగ్గా ఎంచుకోండి.",
  round: "రౌండ్", timeRemaining: "మిగిలిన సమయం", attentionGameTip: "క్రింది లక్ష్య పెట్టెలో చూపిన అదే చిహ్నాన్ని కనుగొనండి.",
  targetLabel: "లక్ష్యం", secondsRemaining: "సెకన్లు మిగిలి ఉన్నాయి", chooseSymbol: "ఈ చిహ్నాన్ని ఎంచుకోండి", attentionGameProgress: "ఆట పురోగతి",
  attentionGameSummary: "రౌండ్ {round} • స్థాయి {level} • సమయం: {time} సె.", attentionRoundProgress: "మొత్తం {total}లో {current}",
  correctAnswers: "సరైన సమాధానాలు", wellDone: "బాగా చేశారు!", attentionCompletedAt: "స్థాయి {level} వద్ద పూర్తయింది",
  answeredCorrectly: "మీరు {total}లో {correct} సరైన సమాధానాలు ఇచ్చారు.", activityCompletedProgressNotSaved: "కార్యకలాపం పూర్తైంది, కానీ పురోగతిని సేవ్ చేయలేకపోయాము.",
};
const attentionGameAssamese = {
  attentionGameEyebrow: "মনোযোগ কাৰ্যকলাপ", attentionGameTitle: "লক্ষ্যত মনোযোগ দিয়ক",
  attentionGameDescription: "লক্ষ্য চিহ্নটো চাওক আৰু যিমান পাৰি সোনকালে আৰু সঠিকভাৱে বাছক।",
  round: "পৰ্যায়", timeRemaining: "বাকী সময়", attentionGameTip: "তলৰ লক্ষ্য বাকচত দেখুওৱা একে চিহ্নটো বিচাৰি উলিয়াওক।",
  targetLabel: "লক্ষ্য", secondsRemaining: "ছেকেণ্ড বাকী", chooseSymbol: "এই চিহ্নটো বাছক", attentionGameProgress: "খেলৰ অগ্ৰগতি",
  attentionGameSummary: "পৰ্যায় {round} • স্তৰ {level} • সময়: {time} ছেকেণ্ড", attentionRoundProgress: "মুঠ {total}ৰ ভিতৰত {current}",
  correctAnswers: "সঠিক উত্তৰ", wellDone: "খুব ভাল!", attentionCompletedAt: "স্তৰ {level}ত সম্পূৰ্ণ হ'ল",
  answeredCorrectly: "আপুনি {total}ৰ ভিতৰত {correct}টা সঠিক উত্তৰ দিলে।", activityCompletedProgressNotSaved: "কাৰ্যকলাপ সম্পূৰ্ণ হ'ল, কিন্তু অগ্ৰগতি সংৰক্ষণ কৰিব নোৱাৰিলে।",
};
const attentionGameBengali = {
  attentionGameEyebrow: "মনোযোগ কার্যক্রম", attentionGameTitle: "লক্ষ্যে মনোযোগ দিন",
  attentionGameDescription: "লক্ষ্য চিহ্নটি দেখুন এবং যত দ্রুত ও সঠিকভাবে সম্ভব সেটি বেছে নিন।",
  round: "পর্ব", timeRemaining: "বাকি সময়", attentionGameTip: "নিচের লক্ষ্য বাক্সে দেখানো একই চিহ্নটি খুঁজুন।",
  targetLabel: "লক্ষ্য", secondsRemaining: "সেকেন্ড বাকি", chooseSymbol: "এই চিহ্নটি বেছে নিন", attentionGameProgress: "খেলার অগ্রগতি",
  attentionGameSummary: "পর্ব {round} • স্তর {level} • সময়: {time} সেকেন্ড", attentionRoundProgress: "মোট {total} এর মধ্যে {current}",
  correctAnswers: "সঠিক উত্তর", wellDone: "খুব ভালো!", attentionCompletedAt: "স্তর {level}-এ সম্পন্ন হয়েছে",
  answeredCorrectly: "আপনি {total}টির মধ্যে {correct}টি সঠিক উত্তর দিয়েছেন।", activityCompletedProgressNotSaved: "কার্যক্রম সম্পন্ন হয়েছে, কিন্তু অগ্রগতি সংরক্ষণ করা যায়নি।",
};
const attentionGameNagamese = {
  attentionGameEyebrow: "Mon dibo activity", attentionGameTitle: "Target te focus koribo",
  attentionGameDescription: "Target symbol sai aru jiman jaldi aru thik paribo, bachibo.",
  round: "Pala", timeRemaining: "Baki time", attentionGameTip: "Niche target box te dikhai thaka eku symbol bisaribo.",
  targetLabel: "Nisana", secondsRemaining: "second baki", chooseSymbol: "Etu symbol bachibo", attentionGameProgress: "Gameor agor gati",
  attentionGameSummary: "Round {round} • Level {level} • Time: {time} second", attentionRoundProgress: "Muth {total} pora {current}",
  correctAnswers: "Thik answers", wellDone: "Besi bhal!", attentionCompletedAt: "Level {level} te complete hoise",
  answeredCorrectly: "Apuni {total} pora {correct} thik answer dise.", activityCompletedProgressNotSaved: "Activity complete hoise, kintu progress save hobo nai.",
};
Object.assign(english, attentionGameEnglish);
Object.assign(hindi, attentionGameHindi);
Object.assign(telugu, attentionGameTelugu);
Object.assign(assamese, attentionGameAssamese);
Object.assign(bengali, attentionGameBengali);
Object.assign(nagamese, attentionGameNagamese);

const patternGameEnglish = {
  patternGameEyebrow: "Pattern Recognition", preparingActivity: "Preparing your activity…", patternGameTitle: "Find the missing pattern",
  patternGameDescription: "Look carefully at the sequence and choose what comes next.", question: "Question", patternGameTip: "Look for what repeats, then choose the symbol that completes the pattern.",
  whatComesNext: "What comes next?", patternActivityCompletion: "You completed the pattern recognition activity.", activityComplete: "Activity complete", difficulty: "Difficulty", backToHome: "Back to Home",
  patternQuestionProgress: "Question {current} of {total}", activityProgress: "Activity progress", answerOption: "Answer: {option}",
};
const patternGameHindi = {
  patternGameEyebrow: "पैटर्न पहचान", preparingActivity: "आपकी गतिविधि तैयार की जा रही है…", patternGameTitle: "गायब पैटर्न खोजें",
  patternGameDescription: "क्रम को ध्यान से देखें और अगला चिन्ह चुनें।", question: "प्रश्न", patternGameTip: "जो दोहराया जा रहा है उसे देखें, फिर पैटर्न पूरा करने वाला चिन्ह चुनें।",
  whatComesNext: "इसके बाद क्या आएगा?", patternActivityCompletion: "आपने पैटर्न पहचान गतिविधि पूरी कर ली है।", activityComplete: "गतिविधि पूरी हुई", difficulty: "कठिनाई", backToHome: "होम पर वापस जाएँ",
  patternQuestionProgress: "प्रश्न {current} / {total}", activityProgress: "गतिविधि प्रगति", answerOption: "उत्तर: {option}",
};
const patternGameTelugu = {
  patternGameEyebrow: "నమూనా గుర్తింపు", preparingActivity: "మీ కార్యకలాపం సిద్ధమవుతోంది…", patternGameTitle: "తప్పిపోయిన నమూనాను కనుగొనండి",
  patternGameDescription: "క్రమాన్ని జాగ్రత్తగా చూసి, తరువాత ఏమి వస్తుందో ఎంచుకోండి.", question: "ప్రశ్న", patternGameTip: "ఏది పునరావృతమవుతుందో చూసి, నమూనాను పూర్తి చేసే చిహ్నాన్ని ఎంచుకోండి.",
  whatComesNext: "తర్వాత ఏమి వస్తుంది?", patternActivityCompletion: "మీరు నమూనా గుర్తింపు కార్యకలాపాన్ని పూర్తి చేశారు.", activityComplete: "కార్యకలాపం పూర్తయింది", difficulty: "కష్టతర స్థాయి", backToHome: "హోమ్‌కు తిరిగి వెళ్లండి",
  patternQuestionProgress: "ప్రశ్న {current} / {total}", activityProgress: "కార్యకలాప పురోగతి", answerOption: "సమాధానం: {option}",
};
const patternGameAssamese = {
  patternGameEyebrow: "আৰ্হি চিনাক্তকৰণ", preparingActivity: "আপোনাৰ কাৰ্যকলাপ প্ৰস্তুত হৈ আছে…", patternGameTitle: "হেৰাই যোৱা আৰ্হিটো বিচাৰি উলিয়াওক",
  patternGameDescription: "ক্ৰমটো মনোযোগেৰে চাওক আৰু তাৰ পিছত কি আহিব বাছক।", question: "প্ৰশ্ন", patternGameTip: "কি পুনৰাবৃত্তি হৈছে চাওক, তাৰ পিছত আৰ্হিটো সম্পূৰ্ণ কৰা চিহ্ন বাছক।",
  whatComesNext: "তাৰ পিছত কি আহিব?", patternActivityCompletion: "আপুনি আৰ্হি চিনাক্তকৰণ কাৰ্যকলাপ সম্পূৰ্ণ কৰিলে।", activityComplete: "কাৰ্যকলাপ সম্পূৰ্ণ", difficulty: "কঠিনতাৰ স্তৰ", backToHome: "হোমলৈ উভতি যাওক",
  patternQuestionProgress: "প্ৰশ্ন {current} / {total}", activityProgress: "কাৰ্যকলাপৰ অগ্ৰগতি", answerOption: "উত্তৰ: {option}",
};
const patternGameBengali = {
  patternGameEyebrow: "প্যাটার্ন শনাক্তকরণ", preparingActivity: "আপনার কার্যক্রম প্রস্তুত হচ্ছে…", patternGameTitle: "হারিয়ে যাওয়া প্যাটার্নটি খুঁজুন",
  patternGameDescription: "ক্রমটি মনোযোগ দিয়ে দেখুন এবং এর পরে কী আসবে বেছে নিন।", question: "প্রশ্ন", patternGameTip: "কী পুনরাবৃত্তি হচ্ছে দেখুন, তারপর প্যাটার্নটি সম্পূর্ণ করা চিহ্নটি বেছে নিন।",
  whatComesNext: "এর পরে কী আসবে?", patternActivityCompletion: "আপনি প্যাটার্ন শনাক্তকরণ কার্যক্রম সম্পন্ন করেছেন।", activityComplete: "কার্যক্রম সম্পন্ন", difficulty: "কঠিনতার স্তর", backToHome: "হোমে ফিরে যান",
  patternQuestionProgress: "প্রশ্ন {current} / {total}", activityProgress: "কার্যক্রমের অগ্রগতি", answerOption: "উত্তর: {option}",
};
const patternGameNagamese = {
  patternGameEyebrow: "Pattern chinibo", preparingActivity: "Apunar activity ready kori ase…", patternGameTitle: "Missing pattern bisaribo",
  patternGameDescription: "Sequence bhal sai aru next te ki ahibo bachibo.", question: "Prosno", patternGameTip: "Ki repeat hoi ase sai, pichete pattern complete koribole symbol bachibo.",
  whatComesNext: "Pichete ki ahibo?", patternActivityCompletion: "Apuni pattern chinibo activity complete korise.", activityComplete: "Activity complete hoise", difficulty: "Kothin level", backToHome: "Home te ghuribo",
  patternQuestionProgress: "Prosno {current} / {total}", activityProgress: "Activityor agor gati", answerOption: "Uttor: {option}",
};
Object.assign(english, patternGameEnglish);
Object.assign(hindi, patternGameHindi);
Object.assign(telugu, patternGameTelugu);
Object.assign(assamese, patternGameAssamese);
Object.assign(bengali, patternGameBengali);
Object.assign(nagamese, patternGameNagamese);

const objectRecognitionEnglish = {
  objectRecognitionTitle: "Recognize the object",
  objectRecognitionDescription: "Look at the object and choose the correct name.",
  objectRecognitionTip: "Look carefully, then select the name that matches the object.",
  whatIsThis: "What is this?",
  objectRecognitionCompletion: "You completed the object recognition activity.",
  objectRecognitionQuestionProgress: "Question {current} of {total}",
  objectRecognitionDifficultyLevel: "Level {level}",
};
const objectRecognitionHindi = {
  objectRecognitionTitle: "वस्तु को पहचानें",
  objectRecognitionDescription: "वस्तु को देखें और सही नाम चुनें।",
  objectRecognitionTip: "ध्यान से देखें, फिर वस्तु के सही नाम को चुनें।",
  whatIsThis: "यह क्या है?",
  objectRecognitionCompletion: "आपने वस्तु पहचान गतिविधि पूरी कर ली है।",
  objectRecognitionQuestionProgress: "प्रश्न {current} / {total}",
  objectRecognitionDifficultyLevel: "स्तर {level}",
};
const objectRecognitionTelugu = {
  objectRecognitionTitle: "వస్తువును గుర్తించండి",
  objectRecognitionDescription: "వస్తువును చూసి సరైన పేరును ఎంచుకోండి.",
  objectRecognitionTip: "జాగ్రత్తగా చూసి, వస్తువుకు సరిపోయే పేరును ఎంచుకోండి.",
  whatIsThis: "ఇది ఏమిటి?",
  objectRecognitionCompletion: "మీరు వస్తువు గుర్తింపు కార్యకలాపాన్ని పూర్తి చేశారు.",
  objectRecognitionQuestionProgress: "ప్రశ్న {current} / {total}",
  objectRecognitionDifficultyLevel: "స్థాయి {level}",
};
const objectRecognitionAssamese = {
  objectRecognitionTitle: "বস্তুটো চিনাক্ত কৰক",
  objectRecognitionDescription: "বস্তুটো চাওক আৰু সঠিক নাম বাছক।",
  objectRecognitionTip: "মনোযোগেৰে চাওক, তাৰ পিছত বস্তুটোৰ সঠিক নাম বাছক।",
  whatIsThis: "এইটো কি?",
  objectRecognitionCompletion: "আপুনি বস্তু চিনাক্তকৰণৰ কাৰ্যকলাপ সম্পূৰ্ণ কৰিলে।",
  objectRecognitionQuestionProgress: "প্ৰশ্ন {current} / {total}",
  objectRecognitionDifficultyLevel: "স্তৰ {level}",
};
const objectRecognitionBengali = {
  objectRecognitionTitle: "বস্তুটি চিনুন",
  objectRecognitionDescription: "বস্তুটি দেখুন এবং সঠিক নাম বেছে নিন।",
  objectRecognitionTip: "মনোযোগ দিয়ে দেখুন, তারপর বস্তুটির সঠিক নাম বেছে নিন।",
  whatIsThis: "এটি কী?",
  objectRecognitionCompletion: "আপনি বস্তু শনাক্তকরণ কার্যক্রমটি সম্পন্ন করেছেন।",
  objectRecognitionQuestionProgress: "প্রশ্ন {current} / {total}",
  objectRecognitionDifficultyLevel: "স্তর {level}",
};
const objectRecognitionNagamese = {
  objectRecognitionTitle: "Bostu chinibo",
  objectRecognitionDescription: "Bostu sai aru thik naam bachibo.",
  objectRecognitionTip: "Bhal sai aru bostu logot mil thaka naam bachibo.",
  whatIsThis: "Etu ki?",
  objectRecognitionCompletion: "Apuni bostu chinibo activity complete korise.",
  objectRecognitionQuestionProgress: "Prosno {current} / {total}",
  objectRecognitionDifficultyLevel: "Dhoron {level}",
};
Object.assign(english, objectRecognitionEnglish);
Object.assign(hindi, objectRecognitionHindi);
Object.assign(telugu, objectRecognitionTelugu);
Object.assign(assamese, objectRecognitionAssamese);
Object.assign(bengali, objectRecognitionBengali);
Object.assign(nagamese, objectRecognitionNagamese);

const dailyRoutineRecallEnglish = {
  dailyRoutineRecallTitle: "Remember your routine",
  dailyRoutineRecallDescription: "Think about your usual daily activities and choose the best answer.",
  dailyRoutineRecallTip: "Read each choice carefully, then select the answer that feels right.",
  dailyRoutineRecallCompletion: "You completed today's routine recall activity.",
  dailyRoutineRecallQuestionProgress: "Question {current} of {total}",
  dailyRoutineRecallDifficultyLevel: "Level {level}",
};
const dailyRoutineRecallHindi = {
  dailyRoutineRecallTitle: "अपनी दिनचर्या याद करें",
  dailyRoutineRecallDescription: "अपनी रोज़ की गतिविधियों के बारे में सोचें और सबसे अच्छा उत्तर चुनें।",
  dailyRoutineRecallTip: "हर विकल्प को ध्यान से पढ़ें और सही उत्तर चुनें।",
  dailyRoutineRecallCompletion: "आपने आज की दिनचर्या याद करने की गतिविधि पूरी कर ली है।",
  dailyRoutineRecallQuestionProgress: "प्रश्न {current} / {total}",
  dailyRoutineRecallDifficultyLevel: "स्तर {level}",
};
const dailyRoutineRecallTelugu = {
  dailyRoutineRecallTitle: "మీ దినచర్యను గుర్తు చేసుకోండి",
  dailyRoutineRecallDescription: "మీ సాధారణ రోజువారీ పనుల గురించి ఆలోచించి సరైన సమాధానాన్ని ఎంచుకోండి.",
  dailyRoutineRecallTip: "ప్రతి ఎంపికను జాగ్రత్తగా చదివి సరైన సమాధానాన్ని ఎంచుకోండి.",
  dailyRoutineRecallCompletion: "మీరు ఈరోజు దినచర్య గుర్తింపు కార్యకలాపాన్ని పూర్తి చేశారు.",
  dailyRoutineRecallQuestionProgress: "ప్రశ్న {current} / {total}",
  dailyRoutineRecallDifficultyLevel: "స్థాయి {level}",
};
const dailyRoutineRecallAssamese = {
  dailyRoutineRecallTitle: "আপোনাৰ দিনচৰ্যা মনত পেলাওক",
  dailyRoutineRecallDescription: "আপোনাৰ দৈনন্দিন কামবোৰৰ বিষয়ে ভাবক আৰু সঠিক উত্তৰ বাছক।",
  dailyRoutineRecallTip: "প্ৰতিটো বিকল্প মনোযোগেৰে পঢ়ক আৰু সঠিক উত্তৰ বাছক।",
  dailyRoutineRecallCompletion: "আপুনি আজিৰ দিনচৰ্যা মনত পেলোৱাৰ কাৰ্যকলাপ সম্পূৰ্ণ কৰিলে।",
  dailyRoutineRecallQuestionProgress: "প্ৰশ্ন {current} / {total}",
  dailyRoutineRecallDifficultyLevel: "স্তৰ {level}",
};
const dailyRoutineRecallBengali = {
  dailyRoutineRecallTitle: "আপনার রুটিন মনে করুন",
  dailyRoutineRecallDescription: "আপনার দৈনন্দিন কাজের কথা ভাবুন এবং সঠিক উত্তরটি বেছে নিন।",
  dailyRoutineRecallTip: "প্রতিটি বিকল্প মনোযোগ দিয়ে পড়ুন এবং সঠিক উত্তরটি বেছে নিন।",
  dailyRoutineRecallCompletion: "আপনি আজকের রুটিন স্মরণ কার্যক্রমটি সম্পন্ন করেছেন।",
  dailyRoutineRecallQuestionProgress: "প্রশ্ন {current} / {total}",
  dailyRoutineRecallDifficultyLevel: "স্তর {level}",
};
const dailyRoutineRecallNagamese = {
  dailyRoutineRecallTitle: "Apunar routine monot anibo",
  dailyRoutineRecallDescription: "Apunar roj kaam khan bhabi aru thik answer bachibo.",
  dailyRoutineRecallTip: "Protek option bhal porhi aru thik answer bachibo.",
  dailyRoutineRecallCompletion: "Apuni ajir routine monot anibo activity complete korise.",
  dailyRoutineRecallQuestionProgress: "Prosno {current} / {total}",
  dailyRoutineRecallDifficultyLevel: "Dhoron {level}",
};
Object.assign(english, dailyRoutineRecallEnglish);
Object.assign(hindi, dailyRoutineRecallHindi);
Object.assign(telugu, dailyRoutineRecallTelugu);
Object.assign(assamese, dailyRoutineRecallAssamese);
Object.assign(bengali, dailyRoutineRecallBengali);
Object.assign(nagamese, dailyRoutineRecallNagamese);

const moodCheckInEnglish = {
  moodCheckInEyebrow: "Emotional well-being",
  moodCheckInTitle: "How are you feeling today?",
  moodCheckInSubtitle: "Choose the feeling that best describes how you feel right now.",
  chooseFeeling: "Choose a feeling",
  moodNoWrongAnswer: "There is no right or wrong answer.",
  moodYouChose: "You chose {mood}",
  moodFeelingSaved: "Feeling saved",
  saveMyFeeling: "Save my feeling",
  moodPrivacy: "Your feelings are private and help you notice your well-being over time.",
  unableToSaveFeeling: "Unable to save your feeling. Please try again.",
  moodHappy: "Happy", moodHappyMessage: "That's wonderful! Keep enjoying your day.",
  moodOkay: "Okay", moodOkayMessage: "That's good. Take your time and enjoy your day.",
  moodNotSure: "Not sure", moodNotSureMessage: "That's okay. Take a gentle moment for yourself.",
  moodWorried: "Worried", moodWorriedMessage: "It's okay to feel worried. Take a slow breath and relax.",
  moodSad: "Sad", moodSadMessage: "I'm sorry you're feeling sad. You are not alone.",
};
const moodCheckInHindi = {
  moodCheckInEyebrow: "भावनात्मक स्वास्थ्य",
  moodCheckInTitle: "आज आप कैसा महसूस कर रहे हैं?",
  moodCheckInSubtitle: "उस भावना को चुनें जो इस समय आपकी भावना को सबसे अच्छी तरह बताती है।",
  chooseFeeling: "अपनी भावना चुनें",
  moodNoWrongAnswer: "कोई उत्तर सही या गलत नहीं है।",
  moodYouChose: "आपने चुना: {mood}",
  moodFeelingSaved: "भावना सहेज ली गई",
  saveMyFeeling: "अपनी भावना सहेजें",
  moodPrivacy: "आपकी भावनाएँ निजी हैं और समय के साथ आपकी सेहत को समझने में मदद करती हैं।",
  unableToSaveFeeling: "आपकी भावना सहेजी नहीं जा सकी। कृपया फिर कोशिश करें।",
  moodHappy: "खुश", moodHappyMessage: "यह बहुत अच्छा है! अपने दिन का आनंद लेते रहें।",
  moodOkay: "ठीक", moodOkayMessage: "यह अच्छा है। आराम से अपना दिन बिताएँ।",
  moodNotSure: "पता नहीं", moodNotSureMessage: "कोई बात नहीं। अपने लिए एक शांत पल लें।",
  moodWorried: "चिंतित", moodWorriedMessage: "चिंतित महसूस करना ठीक है। धीरे से साँस लें और आराम करें।",
  moodSad: "उदास", moodSadMessage: "मुझे दुख है कि आप उदास हैं। आप अकेले नहीं हैं।",
};
const moodCheckInTelugu = {
  moodCheckInEyebrow: "భావోద్వేగ శ్రేయస్సు",
  moodCheckInTitle: "ఈ రోజు మీరు ఎలా భావిస్తున్నారు?",
  moodCheckInSubtitle: "ఇప్పుడు మీరు ఎలా భావిస్తున్నారో ఉత్తమంగా తెలిపే భావనను ఎంచుకోండి.",
  chooseFeeling: "మీ భావనను ఎంచుకోండి",
  moodNoWrongAnswer: "సరైన లేదా తప్పు సమాధానం లేదు.",
  moodYouChose: "మీరు ఎంచుకున్నది: {mood}",
  moodFeelingSaved: "భావన సేవ్ చేయబడింది",
  saveMyFeeling: "నా భావనను సేవ్ చేయండి",
  moodPrivacy: "మీ భావనలు వ్యక్తిగతమైనవి మరియు కాలక్రమేణా మీ శ్రేయస్సును గమనించడంలో సహాయపడతాయి.",
  unableToSaveFeeling: "మీ భావనను సేవ్ చేయలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.",
  moodHappy: "సంతోషంగా", moodHappyMessage: "అది చాలా బాగుంది! మీ రోజును ఆనందంగా గడపండి.",
  moodOkay: "బాగున్నాను", moodOkayMessage: "అది మంచిది. నెమ్మదిగా మీ రోజును ఆనందించండి.",
  moodNotSure: "తెలియదు", moodNotSureMessage: "పర్వాలేదు. మీ కోసం ఒక ప్రశాంతమైన క్షణం తీసుకోండి.",
  moodWorried: "ఆందోళనగా", moodWorriedMessage: "ఆందోళన చెందడం సహజం. నెమ్మదిగా శ్వాస తీసుకుని విశ్రాంతి తీసుకోండి.",
  moodSad: "విచారంగా", moodSadMessage: "మీరు విచారంగా ఉన్నందుకు బాధగా ఉంది. మీరు ఒంటరిగా లేరు.",
};
const moodCheckInAssamese = {
  moodCheckInEyebrow: "আৱেগিক সুস্থতা",
  moodCheckInTitle: "আজি আপোনাৰ কেনে লাগিছে?",
  moodCheckInSubtitle: "এতিয়া আপোনাৰ অনুভৱক আটাইতকৈ ভালদৰে বৰ্ণনা কৰা অনুভূতিটো বাছক।",
  chooseFeeling: "আপোনাৰ অনুভূতি বাছক",
  moodNoWrongAnswer: "ইয়াত কোনো সঠিক বা ভুল উত্তৰ নাই।",
  moodYouChose: "আপুনি বাছিলে: {mood}",
  moodFeelingSaved: "অনুভূতি সংৰক্ষণ কৰা হ’ল",
  saveMyFeeling: "মোৰ অনুভূতি সংৰক্ষণ কৰক",
  moodPrivacy: "আপোনাৰ অনুভূতিবোৰ ব্যক্তিগত আৰু সময়ৰ সৈতে আপোনাৰ সুস্থতা লক্ষ্য কৰাত সহায় কৰে।",
  unableToSaveFeeling: "আপোনাৰ অনুভূতি সংৰক্ষণ কৰিব নোৱাৰিলে। অনুগ্ৰহ কৰি আকৌ চেষ্টা কৰক।",
  moodHappy: "সুখী", moodHappyMessage: "এইটো খুব ভাল! আপোনাৰ দিনটো উপভোগ কৰি থাকক।",
  moodOkay: "ভাল", moodOkayMessage: "এইটো ভাল। সময় লৈ আপোনাৰ দিনটো উপভোগ কৰক।",
  moodNotSure: "নিশ্চিত নহয়", moodNotSureMessage: "কোনো কথা নাই। নিজৰ বাবে অলপ শান্ত সময় লওক।",
  moodWorried: "চিন্তিত", moodWorriedMessage: "চিন্তা অনুভৱ কৰাটো স্বাভাৱিক। লাহে লাহে শ্বাস লওক আৰু জিৰণি লওক।",
  moodSad: "দুখী", moodSadMessage: "আপোনাৰ দুখ লাগিছে বুলি শুনি বেয়া লাগিল। আপুনি অকলশৰীয়া নহয়।",
};
const moodCheckInBengali = {
  moodCheckInEyebrow: "মানসিক সুস্থতা",
  moodCheckInTitle: "আজ আপনার কেমন লাগছে?",
  moodCheckInSubtitle: "এখন আপনার অনুভূতিকে সবচেয়ে ভালোভাবে বর্ণনা করে এমন অনুভূতিটি বেছে নিন।",
  chooseFeeling: "আপনার অনুভূতি বেছে নিন",
  moodNoWrongAnswer: "এখানে কোনো সঠিক বা ভুল উত্তর নেই।",
  moodYouChose: "আপনি বেছে নিয়েছেন: {mood}",
  moodFeelingSaved: "অনুভূতি সংরক্ষিত হয়েছে",
  saveMyFeeling: "আমার অনুভূতি সংরক্ষণ করুন",
  moodPrivacy: "আপনার অনুভূতিগুলি ব্যক্তিগত এবং সময়ের সঙ্গে আপনার সুস্থতা বুঝতে সাহায্য করে।",
  unableToSaveFeeling: "আপনার অনুভূতি সংরক্ষণ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
  moodHappy: "খুশি", moodHappyMessage: "এটি দারুণ! আপনার দিনটি উপভোগ করতে থাকুন।",
  moodOkay: "ভালো", moodOkayMessage: "এটি ভালো। সময় নিয়ে আপনার দিনটি উপভোগ করুন।",
  moodNotSure: "নিশ্চিত নই", moodNotSureMessage: "কোনো সমস্যা নেই। নিজের জন্য একটু শান্ত সময় নিন।",
  moodWorried: "চিন্তিত", moodWorriedMessage: "চিন্তিত হওয়া স্বাভাবিক। ধীরে শ্বাস নিন এবং আরাম করুন।",
  moodSad: "দুঃখিত", moodSadMessage: "আপনার মন খারাপ শুনে দুঃখিত। আপনি একা নন।",
};
const moodCheckInNagamese = {
  moodCheckInEyebrow: "Monor bhal thaka",
  moodCheckInTitle: "Aji apunak keneka lagise?",
  moodCheckInSubtitle: "Etiya apunar feeling bhal pora kowa feeling tu bachibo.",
  chooseFeeling: "Apunar feeling bachibo",
  moodNoWrongAnswer: "Eitu te thik ba bhul answer nai.",
  moodYouChose: "Apuni bacha: {mood}",
  moodFeelingSaved: "Feeling save hoise",
  saveMyFeeling: "Mur feeling save koribo",
  moodPrivacy: "Apunar feelings private ase aru time logot apunar bhal thaka bujhibole help kore.",
  unableToSaveFeeling: "Apunar feeling save hobo nai. Doya kori aru ekbar try koribo.",
  moodHappy: "Khushi", moodHappyMessage: "Eitu bohut bhal! Apunar din anonde thakibo.",
  moodOkay: "Thik ase", moodOkayMessage: "Eitu bhal. Olop somoi loi apunar din enjoy koribo.",
  moodNotSure: "Najane", moodNotSureMessage: "Kunu kotha nai. Nijor lagi olop shanti somoi lobo.",
  moodWorried: "Chinta", moodWorriedMessage: "Chinta lagibo normal ase. Lahi lahi hukh lobo aru aram koribo.",
  moodSad: "Dukhi", moodSadMessage: "Apuni dukhi lagise buli hunile beya lage. Apuni ekla nai.",
};
Object.assign(english, moodCheckInEnglish);
Object.assign(hindi, moodCheckInHindi);
Object.assign(telugu, moodCheckInTelugu);
Object.assign(assamese, moodCheckInAssamese);
Object.assign(bengali, moodCheckInBengali);
Object.assign(nagamese, moodCheckInNagamese);

const familyFamiliarityTrainingEnglish = {
  familyFamiliarityTitle: "Let's remember together",
  preparingFamiliarPhoto: "Preparing a familiar photo…",
  familiarPhotoCouldNotLoad: "The familiar person's photo could not be loaded.",
  couldNotPrepareFamiliaritySession: "Could not prepare the familiarity session.",
  couldNotSaveFamiliaritySession: "Could not save the familiarity session.",
  familiaritySessionComplete: "Familiarity session complete",
  reviewedFamiliarPeople: "You reviewed {count} familiar people.",
  familiarPersonProgress: "Person {current} of {total}",
  thisIs: "This is",
  hearNameAgain: "Hear the name again",
  nextPerson: "Next person",
  finishFamiliarity: "Finish",
};
const familyFamiliarityTrainingHindi = {
  familyFamiliarityTitle: "आइए साथ में याद करें",
  preparingFamiliarPhoto: "परिचित फोटो तैयार की जा रही है…",
  familiarPhotoCouldNotLoad: "परिचित व्यक्ति की फोटो लोड नहीं हो सकी।",
  couldNotPrepareFamiliaritySession: "परिचय सत्र तैयार नहीं हो सका।",
  couldNotSaveFamiliaritySession: "परिचय सत्र सहेजा नहीं जा सका।",
  familiaritySessionComplete: "परिचित लोगों का सत्र पूरा हुआ",
  reviewedFamiliarPeople: "आपने {count} परिचित लोगों को देखा।",
  familiarPersonProgress: "व्यक्ति {current} / {total}",
  thisIs: "ये हैं",
  hearNameAgain: "नाम फिर से सुनें",
  nextPerson: "अगला व्यक्ति",
  finishFamiliarity: "पूरा करें",
};
const familyFamiliarityTrainingTelugu = {
  familyFamiliarityTitle: "కలిసి గుర్తు చేసుకుందాం",
  preparingFamiliarPhoto: "తెలిసిన వ్యక్తి ఫోటో సిద్ధం అవుతోంది…",
  familiarPhotoCouldNotLoad: "తెలిసిన వ్యక్తి ఫోటోను లోడ్ చేయలేకపోయాము.",
  couldNotPrepareFamiliaritySession: "పరిచయ సత్రాన్ని సిద్ధం చేయలేకపోయాము.",
  couldNotSaveFamiliaritySession: "పరిచయ సత్రాన్ని సేవ్ చేయలేకపోయాము.",
  familiaritySessionComplete: "పరిచయ సత్రం పూర్తయింది",
  reviewedFamiliarPeople: "మీరు {count} తెలిసిన వ్యక్తులను చూశారు.",
  familiarPersonProgress: "వ్యక్తి {current} / {total}",
  thisIs: "వీరు",
  hearNameAgain: "పేరును మళ్లీ వినండి",
  nextPerson: "తర్వాతి వ్యక్తి",
  finishFamiliarity: "ముగించు",
};
const familyFamiliarityTrainingAssamese = {
  familyFamiliarityTitle: "একেলগে মনত পেলাওঁ",
  preparingFamiliarPhoto: "চিনাকি ফটো প্ৰস্তুত কৰা হৈছে…",
  familiarPhotoCouldNotLoad: "চিনাকি ব্যক্তিৰ ফটো লোড কৰিব নোৱাৰিলে।",
  couldNotPrepareFamiliaritySession: "চিনাকি সত্র প্ৰস্তুত কৰিব নোৱাৰিলে।",
  couldNotSaveFamiliaritySession: "চিনাকি সত্র সংৰক্ষণ কৰিব নোৱাৰিলে।",
  familiaritySessionComplete: "চিনাকি সত্র সম্পূৰ্ণ",
  reviewedFamiliarPeople: "আপুনি {count} জন চিনাকি ব্যক্তিক চালে।",
  familiarPersonProgress: "ব্যক্তি {current} / {total}",
  thisIs: "এওঁ হৈছে",
  hearNameAgain: "নামটো আকৌ শুনক",
  nextPerson: "পৰৱৰ্তী ব্যক্তি",
  finishFamiliarity: "সমাপ্ত কৰক",
};
const familyFamiliarityTrainingBengali = {
  familyFamiliarityTitle: "চলুন একসাথে মনে করি",
  preparingFamiliarPhoto: "পরিচিত ছবি তৈরি হচ্ছে…",
  familiarPhotoCouldNotLoad: "পরিচিত ব্যক্তির ছবি লোড করা যায়নি।",
  couldNotPrepareFamiliaritySession: "পরিচিতি সেশন প্রস্তুত করা যায়নি।",
  couldNotSaveFamiliaritySession: "পরিচিতি সেশন সংরক্ষণ করা যায়নি।",
  familiaritySessionComplete: "পরিচিতি সেশন সম্পন্ন",
  reviewedFamiliarPeople: "আপনি {count} জন পরিচিত ব্যক্তিকে দেখেছেন।",
  familiarPersonProgress: "ব্যক্তি {current} / {total}",
  thisIs: "ইনি হলেন",
  hearNameAgain: "নামটি আবার শুনুন",
  nextPerson: "পরের ব্যক্তি",
  finishFamiliarity: "শেষ করুন",
};
const familyFamiliarityTrainingNagamese = {
  familyFamiliarityTitle: "Ekloge monot rakhibo",
  preparingFamiliarPhoto: "Chinaki photo tayari kori ase…",
  familiarPhotoCouldNotLoad: "Chinaki manuhor photo load hobo nai.",
  couldNotPrepareFamiliaritySession: "Chinaki session tayari hobo nai.",
  couldNotSaveFamiliaritySession: "Chinaki session save hobo nai.",
  familiaritySessionComplete: "Chinaki session ses hoise",
  reviewedFamiliarPeople: "Apuni {count} jon chinaki manuh sai loise.",
  familiarPersonProgress: "Manuh {current} / {total}",
  thisIs: "Eitu ase",
  hearNameAgain: "Naam tu abar hunibo",
  nextPerson: "Pechor manuh",
  finishFamiliarity: "Ses koribo",
};
Object.assign(english, familyFamiliarityTrainingEnglish);
Object.assign(hindi, familyFamiliarityTrainingHindi);
Object.assign(telugu, familyFamiliarityTrainingTelugu);
Object.assign(assamese, familyFamiliarityTrainingAssamese);
Object.assign(bengali, familyFamiliarityTrainingBengali);
Object.assign(nagamese, familyFamiliarityTrainingNagamese);

const loginEnglish = {
  welcomeTo: "Welcome to", cognitiveCompanionDescription: "Your cognitive companion designed to help you stay engaged, active & connected every day.", securePrivate: "Secure & Private", caregiverConnected: "Caregiver Connected", designedForYou: "Designed for You", createYourAccount: "Create your account", welcomeBack: "Welcome back!", joinWellnessJourney: "Join MINDSET NER and begin your wellness journey.", signInContinue: "Sign in to continue to your MINDSET NER account.", fullName: "Full name", enterFullName: "Enter your full name", emailAddress: "Email address", enterEmailAddress: "Enter your email address", password: "Password", enterPassword: "Enter your password", showOrHidePassword: "Show or hide password", accountType: "Account type", forgotPassword: "Forgot Password?", creatingAccount: "Creating account…", signingIn: "Signing in…", createAccount: "Create Account", signIn: "Sign In", or: "or", alreadyHaveAccountSignIn: "Already have an account? Sign In", createNewAccount: "Create New Account", yourDataSafe: "Your data is safe with us.", securityDescription: "We use advanced security to protect your information.", simple: "Simple", friendly: "Friendly", pleaseEnterEmailPassword: "Please enter your email and password.", loginFailed: "Login failed.", fillRequiredFields: "Please fill in all required fields.", passwordMinimumLength: "Password must be at least 6 characters.", enterPatientAgeGender: "Please enter the patient's age and gender.", failedCreatePatientProfile: "Failed to create patient profile.", registrationFailed: "Registration failed.", accountCreatedSuccessfully: "Account created successfully.",
};
const loginHindi = {
  welcomeTo: "आपका स्वागत है", cognitiveCompanionDescription: "आपका संज्ञानात्मक साथी, जो आपको हर दिन सक्रिय, जुड़े और व्यस्त रहने में सहायता करता है।", securePrivate: "सुरक्षित और निजी", caregiverConnected: "देखभालकर्ता से जुड़ा", designedForYou: "आपके लिए बनाया गया", createYourAccount: "अपना खाता बनाएँ", welcomeBack: "फिर से स्वागत है!", joinWellnessJourney: "MINDSET NER से जुड़ें और अपनी स्वस्थता यात्रा शुरू करें।", signInContinue: "अपने MINDSET NER खाते में जारी रखने के लिए साइन इन करें।", fullName: "पूरा नाम", enterFullName: "अपना पूरा नाम लिखें", emailAddress: "ईमेल पता", enterEmailAddress: "अपना ईमेल पता लिखें", password: "पासवर्ड", enterPassword: "अपना पासवर्ड लिखें", showOrHidePassword: "पासवर्ड दिखाएँ या छिपाएँ", accountType: "खाते का प्रकार", forgotPassword: "पासवर्ड भूल गए?", creatingAccount: "खाता बनाया जा रहा है…", signingIn: "साइन इन हो रहा है…", createAccount: "खाता बनाएँ", signIn: "साइन इन करें", or: "या", alreadyHaveAccountSignIn: "क्या पहले से खाता है? साइन इन करें", createNewAccount: "नया खाता बनाएँ", yourDataSafe: "आपकी जानकारी हमारे पास सुरक्षित है।", securityDescription: "हम आपकी जानकारी की सुरक्षा के लिए उन्नत सुरक्षा का उपयोग करते हैं।", simple: "सरल", friendly: "अनुकूल", pleaseEnterEmailPassword: "कृपया अपना ईमेल और पासवर्ड लिखें।", loginFailed: "साइन इन नहीं हो सका।", fillRequiredFields: "कृपया सभी आवश्यक जानकारी भरें।", passwordMinimumLength: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।", enterPatientAgeGender: "कृपया रोगी की आयु और लिंग लिखें।", failedCreatePatientProfile: "रोगी प्रोफ़ाइल नहीं बन सकी।", registrationFailed: "पंजीकरण नहीं हो सका।", accountCreatedSuccessfully: "खाता सफलतापूर्वक बन गया।",
};
const loginTelugu = {
  welcomeTo: "స్వాగతం", cognitiveCompanionDescription: "ప్రతి రోజు మీరు చురుకుగా, ఆసక్తిగా మరియు అనుసంధానంగా ఉండటానికి సహాయపడే మీ జ్ఞాన సహచరుడు.", securePrivate: "సురక్షితం మరియు వ్యక్తిగతం", caregiverConnected: "సంరక్షకుడితో అనుసంధానం", designedForYou: "మీ కోసం రూపొందించబడింది", createYourAccount: "మీ ఖాతాను సృష్టించండి", welcomeBack: "మళ్లీ స్వాగతం!", joinWellnessJourney: "MINDSET NERలో చేరి మీ శ్రేయస్సు ప్రయాణాన్ని ప్రారంభించండి.", signInContinue: "మీ MINDSET NER ఖాతాలో కొనసాగడానికి సైన్ ఇన్ చేయండి.", fullName: "పూర్తి పేరు", enterFullName: "మీ పూర్తి పేరును నమోదు చేయండి", emailAddress: "ఇమెయిల్ చిరునామా", enterEmailAddress: "మీ ఇమెయిల్ చిరునామాను నమోదు చేయండి", password: "పాస్‌వర్డ్", enterPassword: "మీ పాస్‌వర్డ్‌ను నమోదు చేయండి", showOrHidePassword: "పాస్‌వర్డ్‌ను చూపండి లేదా దాచండి", accountType: "ఖాతా రకం", forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?", creatingAccount: "ఖాతా సృష్టిస్తోంది…", signingIn: "సైన్ ఇన్ అవుతోంది…", createAccount: "ఖాతాను సృష్టించండి", signIn: "సైన్ ఇన్ చేయండి", or: "లేదా", alreadyHaveAccountSignIn: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్ చేయండి", createNewAccount: "కొత్త ఖాతాను సృష్టించండి", yourDataSafe: "మీ సమాచారం మా వద్ద సురక్షితంగా ఉంది.", securityDescription: "మీ సమాచారాన్ని కాపాడటానికి మేము అధునాతన భద్రతను ఉపయోగిస్తాము.", simple: "సులభం", friendly: "స్నేహపూర్వకం", pleaseEnterEmailPassword: "దయచేసి మీ ఇమెయిల్ మరియు పాస్‌వర్డ్‌ను నమోదు చేయండి.", loginFailed: "సైన్ ఇన్ విఫలమైంది.", fillRequiredFields: "దయచేసి అవసరమైన అన్ని వివరాలు నమోదు చేయండి.", passwordMinimumLength: "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.", enterPatientAgeGender: "దయచేసి రోగి వయస్సు మరియు లింగాన్ని నమోదు చేయండి.", failedCreatePatientProfile: "రోగి ప్రొఫైల్‌ను సృష్టించలేకపోయాము.", registrationFailed: "నమోదు విఫలమైంది.", accountCreatedSuccessfully: "ఖాతా విజయవంతంగా సృష్టించబడింది.",
};
const loginAssamese = {
  welcomeTo: "স্বাগতম", cognitiveCompanionDescription: "প্ৰতিদিনে আপোনাক সক্ৰিয়, ব্যস্ত আৰু সংযুক্ত হৈ থাকিবলৈ সহায় কৰা আপোনাৰ জ্ঞানীয় সঙ্গী।", securePrivate: "সুৰক্ষিত আৰু ব্যক্তিগত", caregiverConnected: "যত্নদাতাৰ সৈতে সংযুক্ত", designedForYou: "আপোনাৰ বাবে তৈয়াৰ", createYourAccount: "আপোনাৰ একাউণ্ট খোলক", welcomeBack: "আকৌ স্বাগতম!", joinWellnessJourney: "MINDSET NERত যোগ দি আপোনাৰ সুস্থতাৰ যাত্ৰা আৰম্ভ কৰক।", signInContinue: "আপোনাৰ MINDSET NER একাউণ্টত আগবাঢ়িবলৈ ছাইন ইন কৰক।", fullName: "সম্পূৰ্ণ নাম", enterFullName: "আপোনাৰ সম্পূৰ্ণ নাম লিখক", emailAddress: "ইমেইল ঠিকনা", enterEmailAddress: "আপোনাৰ ইমেইল ঠিকনা লিখক", password: "পাছৱৰ্ড", enterPassword: "আপোনাৰ পাছৱৰ্ড লিখক", showOrHidePassword: "পাছৱৰ্ড দেখুৱাওক বা লুকুৱাওক", accountType: "একাউণ্টৰ ধৰণ", forgotPassword: "পাছৱৰ্ড পাহৰিলে নেকি?", creatingAccount: "একাউণ্ট খোলা হৈছে…", signingIn: "ছাইন ইন হৈ আছে…", createAccount: "একাউণ্ট খোলক", signIn: "ছাইন ইন কৰক", or: "বা", alreadyHaveAccountSignIn: "ইতিমধ্যে একাউণ্ট আছে নে? ছাইন ইন কৰক", createNewAccount: "নতুন একাউণ্ট খোলক", yourDataSafe: "আপোনাৰ তথ্য আমাৰ ওচৰত সুৰক্ষিত।", securityDescription: "আপোনাৰ তথ্য সুৰক্ষিত ৰাখিবলৈ আমি উন্নত সুৰক্ষা ব্যৱহাৰ কৰোঁ।", simple: "সহজ", friendly: "আপোনজন", pleaseEnterEmailPassword: "অনুগ্ৰহ কৰি আপোনাৰ ইমেইল আৰু পাছৱৰ্ড লিখক।", loginFailed: "ছাইন ইন কৰিব নোৱাৰিলে।", fillRequiredFields: "অনুগ্ৰহ কৰি সকলো প্ৰয়োজনীয় তথ্য পূৰণ কৰক।", passwordMinimumLength: "পাছৱৰ্ড কমেও 6টা আখৰৰ হ'ব লাগিব।", enterPatientAgeGender: "অনুগ্ৰহ কৰি ৰোগীৰ বয়স আৰু লিংগ লিখক।", failedCreatePatientProfile: "ৰোগীৰ প্ৰ'ফাইল খোলিব নোৱাৰিলে।", registrationFailed: "পঞ্জীয়ন কৰিব নোৱাৰিলে।", accountCreatedSuccessfully: "একাউণ্ট সফলতাৰে খোলা হ'ল।",
};
const loginBengali = {
  welcomeTo: "স্বাগতম", cognitiveCompanionDescription: "প্রতিদিন আপনাকে সক্রিয়, আগ্রহী ও সংযুক্ত থাকতে সাহায্য করার জন্য আপনার জ্ঞানীয় সঙ্গী।", securePrivate: "নিরাপদ ও ব্যক্তিগত", caregiverConnected: "যত্নদাতার সঙ্গে সংযুক্ত", designedForYou: "আপনার জন্য তৈরি", createYourAccount: "আপনার অ্যাকাউন্ট তৈরি করুন", welcomeBack: "আবার স্বাগতম!", joinWellnessJourney: "MINDSET NER-এ যোগ দিয়ে আপনার সুস্থতার যাত্রা শুরু করুন।", signInContinue: "আপনার MINDSET NER অ্যাকাউন্টে এগোতে সাইন ইন করুন।", fullName: "পুরো নাম", enterFullName: "আপনার পুরো নাম লিখুন", emailAddress: "ইমেইল ঠিকানা", enterEmailAddress: "আপনার ইমেইল ঠিকানা লিখুন", password: "পাসওয়ার্ড", enterPassword: "আপনার পাসওয়ার্ড লিখুন", showOrHidePassword: "পাসওয়ার্ড দেখান বা লুকান", accountType: "অ্যাকাউন্টের ধরন", forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?", creatingAccount: "অ্যাকাউন্ট তৈরি হচ্ছে…", signingIn: "সাইন ইন হচ্ছে…", createAccount: "অ্যাকাউন্ট তৈরি করুন", signIn: "সাইন ইন করুন", or: "অথবা", alreadyHaveAccountSignIn: "ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন", createNewAccount: "নতুন অ্যাকাউন্ট তৈরি করুন", yourDataSafe: "আপনার তথ্য আমাদের কাছে নিরাপদ।", securityDescription: "আপনার তথ্য সুরক্ষিত রাখতে আমরা উন্নত নিরাপত্তা ব্যবহার করি।", simple: "সহজ", friendly: "সহায়ক", pleaseEnterEmailPassword: "অনুগ্রহ করে আপনার ইমেইল ও পাসওয়ার্ড লিখুন।", loginFailed: "সাইন ইন করা যায়নি।", fillRequiredFields: "অনুগ্রহ করে সব প্রয়োজনীয় তথ্য পূরণ করুন।", passwordMinimumLength: "পাসওয়ার্ড কমপক্ষে 6 অক্ষরের হতে হবে।", enterPatientAgeGender: "অনুগ্রহ করে রোগীর বয়স ও লিঙ্গ লিখুন।", failedCreatePatientProfile: "রোগীর প্রোফাইল তৈরি করা যায়নি।", registrationFailed: "নিবন্ধন করা যায়নি।", accountCreatedSuccessfully: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।",
};
const loginNagamese = {
  welcomeTo: "Swagat", cognitiveCompanionDescription: "Apunak protidin active, busy aru connected thakibole help kora apunar monor logor manu.", securePrivate: "Secure aru private", caregiverConnected: "Caregiver logot connected", designedForYou: "Apunar lagi bonai dise", createYourAccount: "Apunar account bonabo", welcomeBack: "Aru ekbar swagat!", joinWellnessJourney: "MINDSET NER te jori apunar bhal thakar jatra shuru koribo.", signInContinue: "Apunar MINDSET NER account te agabo lagi sign in koribo.", fullName: "Pura naam", enterFullName: "Apunar pura naam dibo", emailAddress: "Email thikana", enterEmailAddress: "Apunar email thikana dibo", password: "Password", enterPassword: "Apunar password dibo", showOrHidePassword: "Password dekhabole ba lukaibole", accountType: "Accountor dhoron", forgotPassword: "Password pahori goise niki?", creatingAccount: "Account bonai ase…", signingIn: "Sign in hoi ase…", createAccount: "Account bonabo", signIn: "Sign in koribo", or: "naile", alreadyHaveAccountSignIn: "Ager pora account ase niki? Sign in koribo", createNewAccount: "Notun account bonabo", yourDataSafe: "Apunar data amikhan logot safe ase.", securityDescription: "Apunar information bachaibole ami advanced security use kore.", simple: "Sahaj", friendly: "Apunar logor", pleaseEnterEmailPassword: "Apunar email aru password dibo.", loginFailed: "Sign in hobo nai.", fillRequiredFields: "Sob dorkar information dibo.", passwordMinimumLength: "Password kom se kom 6 ta character thakibo lage.", enterPatientAgeGender: "Patientor boyos aru gender dibo.", failedCreatePatientProfile: "Patient profile bonabo para nai.", registrationFailed: "Registration hobo nai.", accountCreatedSuccessfully: "Account bhalke bonai dise.",
};
Object.assign(english, loginEnglish);
Object.assign(hindi, loginHindi);
Object.assign(telugu, loginTelugu);
Object.assign(assamese, loginAssamese);
Object.assign(bengali, loginBengali);
Object.assign(nagamese, loginNagamese);

const regionalModeEnglish = {
  regionalMode: "Regional Mode",
  regionalModeHelp: "North-Eastern familiar visuals",
};
const regionalModeHindi = {
  regionalMode: "क्षेत्रीय मोड",
  regionalModeHelp: "उत्तर-पूर्व के परिचित दृश्य",
};
const regionalModeTelugu = {
  regionalMode: "ప్రాంతీయ మోడ్",
  regionalModeHelp: "ఈశాన్య ప్రాంతానికి పరిచితమైన దృశ్యాలు",
};
const regionalModeAssamese = {
  regionalMode: "আঞ্চলিক ধৰণ",
  regionalModeHelp: "উত্তৰ-পূবৰ চিনাকি দৃশ্যসমূহ",
};
const regionalModeBengali = {
  regionalMode: "আঞ্চলিক মোড",
  regionalModeHelp: "উত্তর-পূর্বের পরিচিত দৃশ্য",
};
const regionalModeNagamese = {
  regionalMode: "Ancholik Mode",
  regionalModeHelp: "North-Eastor chinaki visuals",
};
Object.assign(english, regionalModeEnglish);
Object.assign(hindi, regionalModeHindi);
Object.assign(telugu, regionalModeTelugu);
Object.assign(assamese, regionalModeAssamese);
Object.assign(bengali, regionalModeBengali);
Object.assign(nagamese, regionalModeNagamese);

const notificationEnglish = {
  reminderNotificationTitle: "Reminder: {title}",
  reminderNotificationBody: "It is time for your scheduled activity.",
  emergencyNotificationChannelName: "Wandering and emergency alerts",
  emergencyNotificationChannelDescription: "Urgent notifications when a patient leaves the configured safe zone.",
  emergencyNotificationTitle: "Emergency: patient outside safe zone",
  emergencyNotificationBody: "{patientName} is {distance} outside the safe zone.",
  emergencyNotificationDistanceKilometers: "{distance} km",
  emergencyNotificationDistanceMeters: "{distance} m",
  emergencyTestPatient: "Test patient",
  yourPatient: "Your patient",
};
const notificationHindi = {
  reminderNotificationTitle: "रिमाइंडर: {title}",
  reminderNotificationBody: "आपकी निर्धारित गतिविधि का समय हो गया है।",
  emergencyNotificationChannelName: "भटकने और आपातकालीन चेतावनियाँ",
  emergencyNotificationChannelDescription: "जब रोगी तय सुरक्षित क्षेत्र से बाहर जाए, तब जरूरी सूचनाएँ।",
  emergencyNotificationTitle: "आपातकाल: रोगी सुरक्षित क्षेत्र के बाहर है",
  emergencyNotificationBody: "{patientName} सुरक्षित क्षेत्र से {distance} बाहर है।",
  emergencyNotificationDistanceKilometers: "{distance} किमी",
  emergencyNotificationDistanceMeters: "{distance} मीटर",
  emergencyTestPatient: "परीक्षण रोगी",
  yourPatient: "आपका रोगी",
};
const notificationTelugu = {
  reminderNotificationTitle: "గుర్తుచూపు: {title}",
  reminderNotificationBody: "మీ నిర్ణయించిన కార్యకలాపానికి ఇది సమయం.",
  emergencyNotificationChannelName: "తిరుగుడు మరియు అత్యవసర హెచ్చరికలు",
  emergencyNotificationChannelDescription: "రోగి నిర్ణయించిన సురక్షిత ప్రాంతం దాటినప్పుడు అత్యవసర నోటిఫికేషన్‌లు.",
  emergencyNotificationTitle: "అత్యవసరం: రోగి సురక్షిత ప్రాంతం వెలుపల ఉన్నారు",
  emergencyNotificationBody: "{patientName} సురక్షిత ప్రాంతానికి {distance} బయట ఉన్నారు.",
  emergencyNotificationDistanceKilometers: "{distance} కి.మీ.",
  emergencyNotificationDistanceMeters: "{distance} మీటర్లు",
  emergencyTestPatient: "పరీక్ష రోగి",
  yourPatient: "మీ రోగి",
};
const notificationAssamese = {
  reminderNotificationTitle: "সোঁৱৰণী: {title}",
  reminderNotificationBody: "আপোনাৰ নিৰ্ধাৰিত কাৰ্যকলাপৰ সময় হ'ল।",
  emergencyNotificationChannelName: "ঘূৰি ফুৰা আৰু জৰুৰী সতৰ্কবাণী",
  emergencyNotificationChannelDescription: "ৰোগী নিৰ্ধাৰিত সুৰক্ষিত অঞ্চল এৰি গ'লে জৰুৰী জাননী।",
  emergencyNotificationTitle: "জৰুৰী: ৰোগী সুৰক্ষিত অঞ্চলৰ বাহিৰত আছে",
  emergencyNotificationBody: "{patientName} সুৰক্ষিত অঞ্চলৰ পৰা {distance} বাহিৰত আছে।",
  emergencyNotificationDistanceKilometers: "{distance} কিমি",
  emergencyNotificationDistanceMeters: "{distance} মিটাৰ",
  emergencyTestPatient: "পৰীক্ষাৰ ৰোগী",
  yourPatient: "আপোনাৰ ৰোগী",
};
const notificationBengali = {
  reminderNotificationTitle: "স্মরণিকা: {title}",
  reminderNotificationBody: "আপনার নির্ধারিত কাজের সময় হয়েছে।",
  emergencyNotificationChannelName: "ঘোরাঘুরি ও জরুরি সতর্কতা",
  emergencyNotificationChannelDescription: "রোগী নির্ধারিত নিরাপদ এলাকার বাইরে গেলে জরুরি বিজ্ঞপ্তি।",
  emergencyNotificationTitle: "জরুরি: রোগী নিরাপদ এলাকার বাইরে আছেন",
  emergencyNotificationBody: "{patientName} নিরাপদ এলাকার {distance} বাইরে আছেন।",
  emergencyNotificationDistanceKilometers: "{distance} কিমি",
  emergencyNotificationDistanceMeters: "{distance} মিটার",
  emergencyTestPatient: "পরীক্ষার রোগী",
  yourPatient: "আপনার রোগী",
};
const notificationNagamese = {
  reminderNotificationTitle: "Monot korai diya: {title}",
  reminderNotificationBody: "Apunar thik kora activity korar time hoise.",
  emergencyNotificationChannelName: "Ghumai phura aru emergency alert",
  emergencyNotificationChannelDescription: "Patient thik kora safe zoneor bahirot gole joruri notification.",
  emergencyNotificationTitle: "Emergency: patient safe zoneor bahirot ase",
  emergencyNotificationBody: "{patientName} safe zoneor {distance} bahirot ase.",
  emergencyNotificationDistanceKilometers: "{distance} km",
  emergencyNotificationDistanceMeters: "{distance} meter",
  emergencyTestPatient: "Porikkhar patient",
  yourPatient: "Apunar patient",
};
Object.assign(english, notificationEnglish);
Object.assign(hindi, notificationHindi);
Object.assign(telugu, notificationTelugu);
Object.assign(assamese, notificationAssamese);
Object.assign(bengali, notificationBengali);
Object.assign(nagamese, notificationNagamese);

const caregiverDashboardDynamicEnglish = {
  moderate: "Moderate", recommendationNoHistory: "No previous activity history. Start with a simple memory activity.", recommendationLowPerformance: "{activity} performance is currently {score}%. Additional practice and caregiver support are recommended.", recommendationMediumPerformance: "{activity} performance is currently {score}%. Additional practice is recommended.", recommendationUnpracticedActivity: "{activity} has not been practiced recently, so broader cognitive training is recommended.", recommendationStablePerformance: "Recent cognitive performance is stable. Continue practicing {activity}.", recommendationMoodSupport: "A gentle and supportive approach may be helpful.", recommendationMoodPositive: "The patient appears to be in a positive mood.", recommendationMoodCalm: "The patient may benefit from a calm and simple activity.", recommendationMoodOkay: "The patient appears to be doing okay.", performanceDeclineAlertTitle: "{activity} Performance Decline", performanceDeclineAlertMessage: "Recent {activity} performance is lower than the previous trend. Monitor the next few activities.", performanceChangeAlertTitle: "{activity} Performance Change", performanceChangeAlertMessage: "Recent {activity} performance shows some decline. Continued activities will show whether the change continues.", performanceStableAlertTitle: "{activity} Performance Stable", performanceStableAlertMessage: "Recent {activity} performance does not show a significant decline.", performanceAlertNeedMoreSessions: "More completed {activity} activities are needed before a performance trend can be shown.", carePlanSummaryActions: "Recommended actions are based on current patient activity, trend, mood, reminder, and safety data.", carePlanSummaryStable: "The patient is currently stable. Continue regular cognitive activities and monitoring.", actionEncourageActivity: "Encourage {activity} activity", actionDecliningAccuracy: "{activity} accuracy declined from {previousScore}% to {recentScore}% across comparable recent sessions.", actionReviewMoodChanges: "Review recent mood changes", actionMoodChanged: "The latest mood is {mood}, which changed from the previous check-in.", actionMoodSupport: "The latest mood check-in is {mood}; a supportive follow-up may be helpful.", actionEncourageRegularCognitive: "Encourage regular cognitive activity", actionNoRecentActivity: "No completed cognitive activity has been recorded in the past 7 days.", actionNoActivityYet: "No completed cognitive activity has been recorded yet.", actionCheckReminderAdherence: "Check reminder adherence", actionReminderAdherence: "Reminder completion is {rate}% across the latest {count} recorded reminders.", actionFollowUpSafety: "Follow up on active safety alert", actionSafetyAttention: "A wandering safety alert is {status} and requires caregiver attention.", riskNeedSixSessions: "At least {count} completed activity sessions are needed before a trend can be shown.", riskNeedRepeatedSessions: "More repeated sessions within an activity are needed to compare performance periods.", riskDecliningExplanation: "Recent activity accuracy is lower than the previous comparable sessions. This is a performance trend, not a medical diagnosis.", riskImprovingExplanation: "Recent activity accuracy is higher than the previous comparable sessions.", riskStableExplanation: "Recent activity performance has remained relatively stable across comparable sessions.",
};
const caregiverDashboardDynamicHindi = {
  moderate: "मध्यम", recommendationNoHistory: "पहले की गतिविधि का इतिहास नहीं है। सरल स्मृति गतिविधि से शुरू करें।", recommendationLowPerformance: "{activity} का प्रदर्शन अभी {score}% है। अतिरिक्त अभ्यास और देखभालकर्ता सहायता की सलाह है।", recommendationMediumPerformance: "{activity} का प्रदर्शन अभी {score}% है। अतिरिक्त अभ्यास की सलाह है।", recommendationUnpracticedActivity: "{activity} का हाल में अभ्यास नहीं हुआ है, इसलिए व्यापक संज्ञानात्मक प्रशिक्षण की सलाह है।", recommendationStablePerformance: "हाल का संज्ञानात्मक प्रदर्शन स्थिर है। {activity} का अभ्यास जारी रखें।", recommendationMoodSupport: "कोमल और सहायक तरीका उपयोगी हो सकता है।", recommendationMoodPositive: "रोगी का मनोदशा सकारात्मक प्रतीत होती है।", recommendationMoodCalm: "रोगी को शांत और सरल गतिविधि से लाभ हो सकता है।", recommendationMoodOkay: "रोगी ठीक प्रतीत होता है।", performanceDeclineAlertTitle: "{activity} प्रदर्शन में गिरावट", performanceDeclineAlertMessage: "हाल का {activity} प्रदर्शन पिछले रुझान से कम है। अगली कुछ गतिविधियों पर नज़र रखें।", performanceChangeAlertTitle: "{activity} प्रदर्शन में बदलाव", performanceChangeAlertMessage: "हाल के {activity} प्रदर्शन में कुछ गिरावट है। आगे की गतिविधियाँ बताएँगी कि बदलाव जारी है या नहीं।", performanceStableAlertTitle: "{activity} प्रदर्शन स्थिर", performanceStableAlertMessage: "हाल के {activity} प्रदर्शन में उल्लेखनीय गिरावट नहीं दिखती।", performanceAlertNeedMoreSessions: "प्रदर्शन रुझान दिखाने के लिए {activity} की और पूर्ण गतिविधियाँ चाहिए।", carePlanSummaryActions: "सुझाए गए कार्य वर्तमान गतिविधि, रुझान, मनोदशा, रिमाइंडर और सुरक्षा जानकारी पर आधारित हैं।", carePlanSummaryStable: "रोगी अभी स्थिर है। नियमित संज्ञानात्मक गतिविधियाँ और निगरानी जारी रखें।", actionEncourageActivity: "{activity} गतिविधि के लिए प्रोत्साहित करें", actionDecliningAccuracy: "तुलनीय हाल के सत्रों में {activity} की सटीकता {previousScore}% से घटकर {recentScore}% हो गई।", actionReviewMoodChanges: "हाल के मनोदशा बदलाव देखें", actionMoodChanged: "नवीनतम मनोदशा {mood} है, जो पिछली जाँच से बदली है।", actionMoodSupport: "नवीनतम मनोदशा जाँच {mood} है; सहायक बातचीत उपयोगी हो सकती है।", actionEncourageRegularCognitive: "नियमित संज्ञानात्मक गतिविधि के लिए प्रोत्साहित करें", actionNoRecentActivity: "पिछले 7 दिनों में कोई पूर्ण संज्ञानात्मक गतिविधि दर्ज नहीं हुई।", actionNoActivityYet: "अभी कोई पूर्ण संज्ञानात्मक गतिविधि दर्ज नहीं हुई।", actionCheckReminderAdherence: "रिमाइंडर पालन जाँचें", actionReminderAdherence: "पिछले {count} दर्ज रिमाइंडरों में पूर्णता {rate}% है।", actionFollowUpSafety: "सक्रिय सुरक्षा चेतावनी पर फॉलो-अप करें", actionSafetyAttention: "भटकने की सुरक्षा चेतावनी {status} है और देखभालकर्ता का ध्यान चाहिए।", riskNeedSixSessions: "रुझान दिखाने के लिए कम से कम {count} पूर्ण गतिविधि सत्र चाहिए।", riskNeedRepeatedSessions: "प्रदर्शन अवधि की तुलना के लिए किसी गतिविधि में और दोहराए गए सत्र चाहिए।", riskDecliningExplanation: "हाल की गतिविधि सटीकता पिछले तुलनीय सत्रों से कम है। यह प्रदर्शन रुझान है, चिकित्सकीय निदान नहीं।", riskImprovingExplanation: "हाल की गतिविधि सटीकता पिछले तुलनीय सत्रों से बेहतर है।", riskStableExplanation: "हाल की गतिविधि का प्रदर्शन तुलनीय सत्रों में अपेक्षाकृत स्थिर रहा है।",
};
const caregiverDashboardDynamicTelugu = { ...caregiverDashboardDynamicEnglish, moderate: "మధ్యస్థం", recommendationNoHistory: "మునుపటి కార్యకలాప చరిత్ర లేదు. సరళమైన జ్ఞాపక కార్యకలాపంతో ప్రారంభించండి.", recommendationLowPerformance: "{activity} పనితీరు ప్రస్తుతం {score}% ఉంది. అదనపు అభ్యాసం మరియు సంరక్షకుల సహాయం సూచించబడింది.", recommendationMediumPerformance: "{activity} పనితీరు ప్రస్తుతం {score}% ఉంది. అదనపు అభ్యాసం సూచించబడింది.", recommendationUnpracticedActivity: "{activity}ను ఇటీవల అభ్యసించలేదు; కాబట్టి విస్తృత జ్ఞాన శిక్షణ సూచించబడింది.", recommendationStablePerformance: "ఇటీవలి జ్ఞాన పనితీరు స్థిరంగా ఉంది. {activity} అభ్యాసాన్ని కొనసాగించండి.", recommendationMoodSupport: "సున్నితమైన, సహాయక విధానం ఉపయోగపడవచ్చు.", recommendationMoodPositive: "రోగి మానసిక స్థితి సానుకూలంగా ఉంది.", recommendationMoodCalm: "రోగికి ప్రశాంతమైన, సరళమైన కార్యకలాపం ఉపయోగపడవచ్చు.", recommendationMoodOkay: "రోగి బాగానే ఉన్నట్లు కనిపిస్తున్నారు.", performanceDeclineAlertTitle: "{activity} పనితీరు తగ్గుదల", performanceDeclineAlertMessage: "ఇటీవలి {activity} పనితీరు మునుపటి ధోరణి కంటే తక్కువగా ఉంది. తదుపరి కొన్ని కార్యకలాపాలను గమనించండి.", performanceChangeAlertTitle: "{activity} పనితీరు మార్పు", performanceChangeAlertMessage: "ఇటీవలి {activity} పనితీరులో కొంత తగ్గుదల ఉంది. మార్పు కొనసాగుతుందో తదుపరి కార్యకలాపాలు తెలియజేస్తాయి.", performanceStableAlertTitle: "{activity} పనితీరు స్థిరంగా ఉంది", performanceStableAlertMessage: "ఇటీవలి {activity} పనితీరులో గణనీయమైన తగ్గుదల లేదు.", performanceAlertNeedMoreSessions: "పనితీరు ధోరణి చూపడానికి మరిన్ని పూర్తి చేసిన {activity} కార్యకలాపాలు అవసరం.", carePlanSummaryActions: "సూచించిన చర్యలు ప్రస్తుత రోగి కార్యకలాపం, ధోరణి, మానసిక స్థితి, గుర్తుచూపు మరియు భద్రత సమాచారంపై ఆధారపడి ఉంటాయి.", carePlanSummaryStable: "రోగి ప్రస్తుతం స్థిరంగా ఉన్నారు. క్రమమైన జ్ఞాన కార్యకలాపాలు మరియు పర్యవేక్షణ కొనసాగించండి.", actionEncourageActivity: "{activity} కార్యకలాపానికి ప్రోత్సహించండి", actionDecliningAccuracy: "తులనీయమైన ఇటీవలి సెషన్‌లలో {activity} ఖచ్చితత్వం {previousScore}% నుండి {recentScore}%కు తగ్గింది.", actionReviewMoodChanges: "ఇటీవలి మానసిక స్థితి మార్పులను చూడండి", actionMoodChanged: "తాజా మానసిక స్థితి {mood}; ఇది మునుపటి తనిఖీ నుండి మారింది.", actionMoodSupport: "తాజా మానసిక స్థితి తనిఖీ {mood}; సహాయకంగా మాట్లాడటం ఉపయోగపడవచ్చు.", actionEncourageRegularCognitive: "క్రమమైన జ్ఞాన కార్యకలాపానికి ప్రోత్సహించండి", actionNoRecentActivity: "గత 7 రోజులలో పూర్తి చేసిన జ్ఞాన కార్యకలాపం నమోదు కాలేదు.", actionNoActivityYet: "ఇంకా పూర్తి చేసిన జ్ఞాన కార్యకలాపం నమోదు కాలేదు.", actionCheckReminderAdherence: "గుర్తుచూపు పాటింపును తనిఖీ చేయండి", actionReminderAdherence: "చివరి {count} నమోదైన గుర్తుచూపులలో పూర్తి చేయడం {rate}% ఉంది.", actionFollowUpSafety: "సక్రియ భద్రత హెచ్చరికపై అనుసరించండి", actionSafetyAttention: "తిరుగుడు భద్రత హెచ్చరిక {status}లో ఉంది; సంరక్షకుల శ్రద్ధ అవసరం.", riskNeedSixSessions: "ధోరణి చూపడానికి కనీసం {count} పూర్తి చేసిన కార్యకలాప సెషన్‌లు అవసరం.", riskNeedRepeatedSessions: "పనితీరు కాలాలను పోల్చడానికి ఒక కార్యకలాపంలో మరిన్ని పునరావృత సెషన్‌లు అవసరం.", riskDecliningExplanation: "ఇటీవలి కార్యకలాప ఖచ్చితత్వం మునుపటి తులనీయ సెషన్‌ల కంటే తక్కువగా ఉంది. ఇది పనితీరు ధోరణి మాత్రమే, వైద్య నిర్ధారణ కాదు.", riskImprovingExplanation: "ఇటీవలి కార్యకలాప ఖచ్చితత్వం మునుపటి తులనీయ సెషన్‌ల కంటే మెరుగ్గా ఉంది.", riskStableExplanation: "ఇటీవలి కార్యకలాప పనితీరు తులనీయ సెషన్‌లలో సాపేక్షంగా స్థిరంగా ఉంది." };
const caregiverDashboardDynamicAssamese = { ...caregiverDashboardDynamicEnglish, moderate: "মধ্যম", recommendationNoHistory: "আগৰ কাৰ্যকলাপৰ ইতিহাস নাই। সহজ স্মৃতি কাৰ্যকলাপৰ পৰা আৰম্ভ কৰক।", recommendationLowPerformance: "{activity}-ৰ প্ৰদৰ্শন এতিয়া {score}%। অধিক অনুশীলন আৰু যত্নদাতাৰ সহায়ৰ পৰামৰ্শ দিয়া হৈছে।", recommendationMediumPerformance: "{activity}-ৰ প্ৰদৰ্শন এতিয়া {score}%। অধিক অনুশীলনৰ পৰামৰ্শ দিয়া হৈছে।", recommendationUnpracticedActivity: "{activity} শেহতীয়াকৈ অনুশীলন কৰা হোৱা নাই; সেয়ে বহল জ্ঞানীয় প্ৰশিক্ষণৰ পৰামৰ্শ দিয়া হৈছে।", recommendationStablePerformance: "শেহতীয়া জ্ঞানীয় প্ৰদৰ্শন স্থিৰ। {activity}-ৰ অনুশীলন চলাই যাওক।", recommendationMoodSupport: "নম্ৰ আৰু সহায়ক পদ্ধতি উপকাৰী হ'ব পাৰে।", recommendationMoodPositive: "ৰোগীৰ মেজাজ ইতিবাচক যেন লাগিছে।", recommendationMoodCalm: "ৰোগীয়ে শান্ত আৰু সহজ কাৰ্যকলাপৰ পৰা লাভবান হ'ব পাৰে।", recommendationMoodOkay: "ৰোগী ভালেই আছে যেন লাগে।", performanceDeclineAlertTitle: "{activity} প্ৰদৰ্শন হ্ৰাস", performanceDeclineAlertMessage: "শেহতীয়া {activity} প্ৰদৰ্শন আগৰ ধাৰাতকৈ কম। পৰৱৰ্তী কেইটামান কাৰ্যকলাপ লক্ষ্য কৰক।", performanceChangeAlertTitle: "{activity} প্ৰদৰ্শন পৰিৱৰ্তন", performanceChangeAlertMessage: "শেহতীয়া {activity} প্ৰদৰ্শনত কিছু হ্ৰাস আছে। পৰৱৰ্তী কাৰ্যকলাপে পৰিৱৰ্তন চলি আছে নে নাই দেখুৱাব।", performanceStableAlertTitle: "{activity} প্ৰদৰ্শন স্থিৰ", performanceStableAlertMessage: "শেহতীয়া {activity} প্ৰদৰ্শনত উল্লেখযোগ্য হ্ৰাস নাই।", performanceAlertNeedMoreSessions: "প্ৰদৰ্শনৰ ধাৰা দেখুৱাবলৈ অধিক সম্পূৰ্ণ {activity} কাৰ্যকলাপৰ প্ৰয়োজন।", carePlanSummaryActions: "পৰামৰ্শ দিয়া পদক্ষেপসমূহ বৰ্তমানৰ ৰোগী কাৰ্যকলাপ, ধাৰা, মেজাজ, সোঁৱৰণী আৰু সুৰক্ষা তথ্যৰ ওপৰত ভিত্তি কৰি আছে।", carePlanSummaryStable: "ৰোগী বৰ্তমান স্থিৰ। নিয়মীয়া জ্ঞানীয় কাৰ্যকলাপ আৰু নিৰীক্ষণ চলাই যাওক।", actionEncourageActivity: "{activity} কাৰ্যকলাপৰ বাবে উৎসাহ দিয়ক", actionDecliningAccuracy: "তুলনীয় শেহতীয়া সত্রত {activity}-ৰ শুদ্ধতা {previousScore}%ৰ পৰা {recentScore}%লৈ কমিছে।", actionReviewMoodChanges: "শেহতীয়া মেজাজৰ পৰিৱৰ্তন চাওক", actionMoodChanged: "শেহতীয়া মেজাজ {mood}; ই আগৰ পৰীক্ষাৰ পৰা সলনি হৈছে।", actionMoodSupport: "শেহতীয়া মেজাজ পৰীক্ষা {mood}; সহায়ক কথা-বতৰা উপকাৰী হ'ব পাৰে।", actionEncourageRegularCognitive: "নিয়মীয়া জ্ঞানীয় কাৰ্যকলাপৰ বাবে উৎসাহ দিয়ক", actionNoRecentActivity: "যোৱা ৭ দিনত কোনো সম্পূৰ্ণ জ্ঞানীয় কাৰ্যকলাপ লিপিবদ্ধ হোৱা নাই।", actionNoActivityYet: "এতিয়াও কোনো সম্পূৰ্ণ জ্ঞানীয় কাৰ্যকলাপ লিপিবদ্ধ হোৱা নাই।", actionCheckReminderAdherence: "সোঁৱৰণী পালন পৰীক্ষা কৰক", actionReminderAdherence: "শেহতীয়া {count}টা লিপিবদ্ধ সোঁৱৰণীৰ সম্পূৰ্ণতা {rate}%।", actionFollowUpSafety: "সক্ৰিয় সুৰক্ষা সতৰ্কবাণীৰ পিছত খবৰ লওক", actionSafetyAttention: "ঘূৰি ফুৰা-সংক্রান্ত সুৰক্ষা সতৰ্কবাণী {status}ত আছে আৰু যত্নদাতাৰ মনোযোগৰ প্ৰয়োজন।", riskNeedSixSessions: "ধাৰা দেখুৱাবলৈ কমেও {count}টা সম্পূৰ্ণ কাৰ্যকলাপ সত্রৰ প্ৰয়োজন।", riskNeedRepeatedSessions: "প্ৰদৰ্শনৰ সময় তুলনা কৰিবলৈ এটা কাৰ্যকলাপত অধিক পুনৰাবৃত্ত সত্রৰ প্ৰয়োজন।", riskDecliningExplanation: "শেহতীয়া কাৰ্যকলাপৰ শুদ্ধতা আগৰ তুলনীয় সত্রতকৈ কম। ই প্ৰদৰ্শনৰ ধাৰা, চিকিৎসাজনিত নিৰ্ণয় নহয়।", riskImprovingExplanation: "শেহতীয়া কাৰ্যকলাপৰ শুদ্ধতা আগৰ তুলনীয় সত্রতকৈ উন্নত।", riskStableExplanation: "শেহতীয়া কাৰ্যকলাপৰ প্ৰদৰ্শন তুলনীয় সত্রসমূহত মোটামুটি স্থিৰ আছে।" };
const caregiverDashboardDynamicBengali = { ...caregiverDashboardDynamicEnglish, moderate: "মাঝারি", recommendationNoHistory: "আগের কার্যকলাপের ইতিহাস নেই। সহজ স্মৃতি কার্যকলাপ দিয়ে শুরু করুন।", recommendationLowPerformance: "{activity}-এর কর্মদক্ষতা এখন {score}%। অতিরিক্ত অনুশীলন ও যত্নদাতার সহায়তা পরামর্শ দেওয়া হচ্ছে।", recommendationMediumPerformance: "{activity}-এর কর্মদক্ষতা এখন {score}%। অতিরিক্ত অনুশীলন পরামর্শ দেওয়া হচ্ছে।", recommendationUnpracticedActivity: "{activity} সম্প্রতি অনুশীলন করা হয়নি; তাই বিস্তৃত জ্ঞানীয় প্রশিক্ষণের পরামর্শ দেওয়া হচ্ছে।", recommendationStablePerformance: "সাম্প্রতিক জ্ঞানীয় কর্মদক্ষতা স্থিতিশীল। {activity}-এর অনুশীলন চালিয়ে যান।", recommendationMoodSupport: "নরম ও সহায়ক পদ্ধতি উপকারী হতে পারে।", recommendationMoodPositive: "রোগীর মেজাজ ইতিবাচক বলে মনে হচ্ছে।", recommendationMoodCalm: "রোগী শান্ত ও সহজ কার্যকলাপ থেকে উপকৃত হতে পারেন।", recommendationMoodOkay: "রোগী ভালো আছেন বলে মনে হচ্ছে।", performanceDeclineAlertTitle: "{activity} কর্মদক্ষতা হ্রাস", performanceDeclineAlertMessage: "সাম্প্রতিক {activity} কর্মদক্ষতা আগের প্রবণতার চেয়ে কম। পরের কয়েকটি কার্যকলাপ পর্যবেক্ষণ করুন।", performanceChangeAlertTitle: "{activity} কর্মদক্ষতার পরিবর্তন", performanceChangeAlertMessage: "সাম্প্রতিক {activity} কর্মদক্ষতায় কিছু হ্রাস আছে। পরের কার্যকলাপগুলি পরিবর্তনটি চলছে কি না দেখাবে।", performanceStableAlertTitle: "{activity} কর্মদক্ষতা স্থিতিশীল", performanceStableAlertMessage: "সাম্প্রতিক {activity} কর্মদক্ষতায় উল্লেখযোগ্য হ্রাস নেই।", performanceAlertNeedMoreSessions: "কর্মদক্ষতার প্রবণতা দেখাতে আরও সম্পূর্ণ {activity} কার্যকলাপ প্রয়োজন।", carePlanSummaryActions: "প্রস্তাবিত পদক্ষেপগুলি বর্তমান রোগীর কার্যকলাপ, প্রবণতা, মেজাজ, স্মরণিকা ও নিরাপত্তা তথ্যের উপর ভিত্তি করে।", carePlanSummaryStable: "রোগী বর্তমানে স্থিতিশীল। নিয়মিত জ্ঞানীয় কার্যকলাপ ও পর্যবেক্ষণ চালিয়ে যান।", actionEncourageActivity: "{activity} কার্যকলাপে উৎসাহ দিন", actionDecliningAccuracy: "তুলনীয় সাম্প্রতিক সেশনগুলিতে {activity}-এর নির্ভুলতা {previousScore}% থেকে {recentScore}% হয়েছে।", actionReviewMoodChanges: "সাম্প্রতিক মেজাজ পরিবর্তন দেখুন", actionMoodChanged: "সর্বশেষ মেজাজ {mood}; এটি আগের পরীক্ষার থেকে বদলেছে।", actionMoodSupport: "সর্বশেষ মেজাজ পরীক্ষা {mood}; সহায়ক কথা বলা উপকারী হতে পারে।", actionEncourageRegularCognitive: "নিয়মিত জ্ঞানীয় কার্যকলাপে উৎসাহ দিন", actionNoRecentActivity: "গত ৭ দিনে কোনো সম্পূর্ণ জ্ঞানীয় কার্যকলাপ নথিভুক্ত হয়নি।", actionNoActivityYet: "এখনও কোনো সম্পূর্ণ জ্ঞানীয় কার্যকলাপ নথিভুক্ত হয়নি।", actionCheckReminderAdherence: "স্মরণিকা পালন পরীক্ষা করুন", actionReminderAdherence: "সর্বশেষ {count}টি নথিভুক্ত স্মরণিকায় সম্পূর্ণতা {rate}%।", actionFollowUpSafety: "সক্রিয় নিরাপত্তা সতর্কতার ফলো-আপ করুন", actionSafetyAttention: "ঘোরাঘুরি-সংক্রান্ত নিরাপত্তা সতর্কতা {status} অবস্থায় আছে এবং যত্নদাতার মনোযোগ প্রয়োজন।", riskNeedSixSessions: "প্রবণতা দেখাতে অন্তত {count}টি সম্পূর্ণ কার্যকলাপ সেশন প্রয়োজন।", riskNeedRepeatedSessions: "কর্মদক্ষতার সময়কাল তুলনা করতে একটি কার্যকলাপে আরও পুনরাবৃত্ত সেশন প্রয়োজন।", riskDecliningExplanation: "সাম্প্রতিক কার্যকলাপের নির্ভুলতা আগের তুলনীয় সেশনগুলির চেয়ে কম। এটি কর্মদক্ষতার প্রবণতা, চিকিৎসাগত নির্ণয় নয়।", riskImprovingExplanation: "সাম্প্রতিক কার্যকলাপের নির্ভুলতা আগের তুলনীয় সেশনগুলির চেয়ে ভালো।", riskStableExplanation: "সাম্প্রতিক কার্যকলাপের কর্মদক্ষতা তুলনীয় সেশনগুলিতে তুলনামূলকভাবে স্থিতিশীল রয়েছে।" };
const caregiverDashboardDynamicNagamese = { ...caregiverDashboardDynamicEnglish, moderate: "Majot", recommendationNoHistory: "Agor activity history nai. Sahaj memory activity pora shuru koribo.", recommendationLowPerformance: "{activity}or performance etiya {score}% ase. Aru practice aru caregiveror help dorkar ase.", recommendationMediumPerformance: "{activity}or performance etiya {score}% ase. Aru practice koribole poramorsho ase.", recommendationUnpracticedActivity: "{activity} notun din khan practice hoa nai; bisi monor training koribole poramorsho ase.", recommendationStablePerformance: "Notun monor performance stable ase. {activity} practice kori thakibo.", recommendationMoodSupport: "Naram aru support diya dhoron bhal hobo pare.", recommendationMoodPositive: "Patientor mood positive jen lage.", recommendationMoodCalm: "Patientor lagi shant aru sahaj activity bhal hobo pare.", recommendationMoodOkay: "Patient bhal ase jen lage.", performanceDeclineAlertTitle: "{activity} performance komi ase", performanceDeclineAlertMessage: "Notun {activity} performance agor trendor pora kom ase. Agor kichu activity dekhi thakibo.", performanceChangeAlertTitle: "{activity} performance bodli ase", performanceChangeAlertMessage: "Notun {activity} performance te olop komti ase. Agor activity khan pora bujha jabo eitu thaki ase niki.", performanceStableAlertTitle: "{activity} performance stable ase", performanceStableAlertMessage: "Notun {activity} performance te dangor komti nai.", performanceAlertNeedMoreSessions: "Performance trend dekhabo lagi aru pura kora {activity} activity lage.", carePlanSummaryActions: "Poramorsho diya kaam etiyar patient activity, trend, mood, reminder aru safety data uporot ase.", carePlanSummaryStable: "Patient etiya stable ase. Niyom hoi monor activity aru monitoring kori thakibo.", actionEncourageActivity: "{activity} activity koribole utsah dibo", actionDecliningAccuracy: "Tulona kora notun session khan te {activity}or thik thaka {previousScore}% pora {recentScore}% hoise.", actionReviewMoodChanges: "Notun mood bodli khan sabi", actionMoodChanged: "Notun mood {mood} ase; agor check pora bodli hoise.", actionMoodSupport: "Notun mood check {mood} ase; support diya kotha pata bhal hobo pare.", actionEncourageRegularCognitive: "Niyom hoi monor activity koribole utsah dibo", actionNoRecentActivity: "Juwa 7 din te kunu pura kora monor activity record nai.", actionNoActivityYet: "Etiya loi kunu pura kora monor activity record nai.", actionCheckReminderAdherence: "Reminder mani chola sabi", actionReminderAdherence: "Notun {count} ta record kora reminder te pura kora {rate}% ase.", actionFollowUpSafety: "Active safety alertor khobor lobo", actionSafetyAttention: "Ghuribole laga safety alert {status} te ase aru caregiveror dhyan lage.", riskNeedSixSessions: "Trend dekhabo lagi kom se kom {count} ta pura kora activity session lage.", riskNeedRepeatedSessions: "Performance time tulona koribole ek activity te aru repeat session lage.", riskDecliningExplanation: "Notun activityor thik thaka agor tulona kora sessionor pora kom ase. Eitu performance trend, medical diagnosis nohoi.", riskImprovingExplanation: "Notun activityor thik thaka agor tulona kora sessionor pora bhal ase.", riskStableExplanation: "Notun activityor performance tulona kora session khan te motamoti stable ase." };

const dictionaries = Object.freeze({
  "en-IN": Object.freeze({ ...english, ...patientProfileEnglish, ...patientReminderListEnglish, ...patientReminderOverlayEnglish, ...reminderManagerEnglish, ...adminPatientLinkEnglish, ...healthcareEnglish, ...healthcareWorkerRequestsEnglish, ...caregiverDashboardEnglish, ...caregiverDashboardTemplatesEnglish, ...caregiverDashboardStatusEnglish, ...caregiverDashboardActivityEnglish, ...caregiverReportEnglish, ...caregiverDashboardDynamicEnglish }),
  "hi-IN": Object.freeze({ ...english, ...patientProfileEnglish, ...patientReminderListEnglish, ...patientReminderOverlayEnglish, ...reminderManagerEnglish, ...adminPatientLinkEnglish, ...healthcareEnglish, ...healthcareWorkerRequestsEnglish, ...hindi, ...patientProfileHindi, ...patientReminderListHindi, ...patientReminderOverlayHindi, ...reminderManagerHindi, ...adminPatientLinkHindi, ...healthcareHindi, ...healthcareWorkerRequestsHindi, ...caregiverDashboardHindi, ...caregiverDashboardTemplatesHindi, ...caregiverDashboardStatusHindi, ...caregiverDashboardActivityHindi, ...caregiverReportHindi, ...caregiverDashboardDynamicHindi }),
  "te-IN": Object.freeze({ ...english, ...patientProfileEnglish, ...patientReminderListEnglish, ...patientReminderOverlayEnglish, ...reminderManagerEnglish, ...adminPatientLinkEnglish, ...healthcareEnglish, ...healthcareWorkerRequestsEnglish, ...telugu, ...patientProfileTelugu, ...patientReminderListTelugu, ...patientReminderOverlayTelugu, ...reminderManagerTelugu, ...adminPatientLinkTelugu, ...healthcareTelugu, ...healthcareWorkerRequestsTelugu, ...caregiverDashboardTelugu, ...caregiverDashboardAdditionalTelugu, ...caregiverDashboardTemplatesTelugu, ...caregiverDashboardStatusTelugu, ...caregiverDashboardActivityTelugu, ...caregiverReportTelugu, ...caregiverDashboardDynamicTelugu }),
  "as-IN": Object.freeze({ ...english, ...patientProfileEnglish, ...patientReminderListEnglish, ...patientReminderOverlayEnglish, ...reminderManagerEnglish, ...adminPatientLinkEnglish, ...healthcareEnglish, ...healthcareWorkerRequestsEnglish, ...assamese, ...patientProfileAssamese, ...patientReminderListAssamese, ...patientReminderOverlayAssamese, ...reminderManagerAssamese, ...adminPatientLinkAssamese, ...healthcareAssamese, ...healthcareWorkerRequestsAssamese, ...caregiverDashboardAssamese, ...caregiverDashboardAdditionalAssamese, ...caregiverDashboardTemplatesAssamese, ...caregiverDashboardStatusAssamese, ...caregiverDashboardActivityAssamese, ...caregiverReportAssamese, ...caregiverDashboardDynamicAssamese }),
  "bn-IN": Object.freeze({ ...english, ...patientProfileEnglish, ...patientReminderListEnglish, ...patientReminderOverlayEnglish, ...reminderManagerEnglish, ...adminPatientLinkEnglish, ...healthcareEnglish, ...healthcareWorkerRequestsEnglish, ...bengali, ...patientProfileBengali, ...patientReminderListBengali, ...patientReminderOverlayBengali, ...reminderManagerBengali, ...adminPatientLinkBengali, ...healthcareBengali, ...healthcareWorkerRequestsBengali, ...caregiverDashboardBengali, ...caregiverDashboardAdditionalBengali, ...caregiverDashboardTemplatesBengali, ...caregiverDashboardStatusBengali, ...caregiverDashboardActivityBengali, ...caregiverReportBengali, ...caregiverDashboardDynamicBengali }),
  "nag-IN": Object.freeze({ ...english, ...patientProfileEnglish, ...patientReminderListEnglish, ...patientReminderOverlayEnglish, ...reminderManagerEnglish, ...adminPatientLinkEnglish, ...healthcareEnglish, ...healthcareWorkerRequestsEnglish, ...nagamese, ...patientProfileNagamese, ...patientReminderListNagamese, ...patientReminderOverlayNagamese, ...reminderManagerNagamese, ...adminPatientLinkNagamese, ...healthcareNagamese, ...healthcareWorkerRequestsNagamese, ...caregiverDashboardNagamese, ...caregiverDashboardAdditionalNagamese, ...caregiverDashboardTemplatesNagamese, ...caregiverDashboardStatusNagamese, ...caregiverDashboardActivityNagamese, ...caregiverReportNagamese, ...caregiverDashboardDynamicNagamese }),
});

const interpolateUIText = (value, params) => {
  if (typeof value !== "string" || !params) return value;
  return value.replace(/\{(\w+)\}/g, (placeholder, name) => (
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : placeholder
  ));
};

export const getUIText = (language, key, params) => {
  const locale = dictionaries[normalizeUILanguage(language)];
  return interpolateUIText(locale[key] ?? english[key] ?? key, params);
};

// Existing callers import `uiText`; retain that API while normalizing language aliases.
export const uiText = getUIText;
