import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Modal, BackHandler, Linking, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ================= मास्टर डेटा - 329 सदस्य (शीट से स्वतः लोड) =================
// फॉर्मेट: नाम|पता|ब्लॉक|मोबाइल|पद|मोनो नंबर|गाड़ी संख्या|कंपनी|मॉडल
const SEED_MEMBERS: string[] = [
  'धनंजय साहू|लखनपुरी|चारामा|8827037893|जिला अध्यक्ष|1|1|कुबोटा|',
  'चंद्रप्रकाश टेकाम|पोटगांव|कांकेर|7000176753|जिला उपाध्यक्ष|2|1|लोवोल|',
  'निलेश लोनहारे|टिकरापारा(हल्बा)|चारामा|6260308341|जिला सचिव|3,4|2||',
  'प्रदीप साहू|तेलगरा|चारामा|6260041370|जिला कोषाध्यक्ष|5|1|वर्धमान|',
  'टार्जन कतलाम|पिपरौद|चारामा|9479025929|जिला मीडिया प्रभारी|6|1|लोवोल|2025',
  'पूरन साहू|चिनौरी|चारामा|7000719264|जिला मीडिया प्रभारी|7|2|लोवोल|2025-2026',
  'ज्ञानेश्वर साहू|पिपरौद|चारामा|9301475709|जिला सलाहकार|8,9|2|वर्धमान, जॉन डियर W 50|',
  'आशीष तिवारी|ढोकला|चारामा|7999033499|जिला सलाहकार|10|1||',
  'विरेन्द्र गोटी|जैसाकर्रा|चारामा|7000271004|जिला सलाहकार|11,12|2||',
  'अंजोर साहू|बेवरती|कांकेर|9340086868|जिला सलाहकार|13,14|2||',
  'मुकेश सिन्हा|नवडबरी|नरहरपुर|6266292400|जिला सलाहकार|15|1||',
  'आशीष यादव|कोरर|भानुप्रतापपुर|9406379113|उपाध्यक्ष भानु ब्लॉक|16,17,18|3||',
  'सुंदर साहू|पिपरौद|चारामा|7587167478|जिला सलाहकार|19|1|वीर|2025',
  'अजीत दुग्गा|सोनपाल|दुर्गकोंदल|7587216639|जिला सलाहकार|20|1|यानमार|',
  'सन्नू दुग्गा|सोनपाल|दुर्गकोंदल|7587216639|सदस्य|21|1|यानमार|',
  'अमित लाल पुडो|पचांगी|दुर्गकोंदल|9691546582|जिला सलाहकार|22,23|1||',
  'राजेश कुमार पुडो|पचांगी|दुर्गकोंदल|7693030204|सदस्य|23,22|1||',
  'जितेंद्र साहू|ढोकला|चारामा|9340121876|जिला सलाहकार|24|1|वर्धमान|',
  'सूरज राम कुमेटी|खैरवाही|चारामा|9406093563|जिला सलाहकार|25|1|वीर|',
  'नरेंद्र नाग|चारामा|चारामा|9340130816|जिला सलाहकार|26|1|वर्धमान|',
  'भीम साहू|बेवरती|कांकेर|9131051018|जिला सलाहकार|27.28|2|कुबोटा|',
  'नीरज साहू|केवटिनटोला|कांकेर|8120694471|मीडिया प्रभारी भानु ब्लॉक|29|1||',
  'ऐश्वर्य साहू|केवटिनटोला|कांकेर|6263885724|सलाहकार भानु ब्लॉक|30|1||',
  'दुलेश सिन्हा|भानपुरी|चारामा|9617943775|सदस्य|31,32|2||',
  'खिलावन साहू|केवटिनटोला|कांकेर|9343822077|सलाहकार भानु ब्लॉक|33|1||',
  'संतोष जुर्री|कानापोंड|चारामा|9407710226|सदस्य|34|1|सिल्वर|',
  'मानेश कुल्हरिया|पोटगांव|कांकेर|6264350705|सदस्य|35|1||',
  'आनंद साहू|सेलेगांव|भानुप्रतापपुर|9406000288|अध्यक्ष भानु ब्लॉक|36,37|2||',
  'नारायण साहू|बागडोंगरी|चारामा|9294732583|सदस्य|38|1|वीर|',
  'हेमलाल हिचामी|बागडोंगरी|चारामा|9516344750|सदस्य|39|1|लोवोल|',
  'फूलसिंग बढ़ई|चिखली|दुर्गकोंदल|9238013958|सदस्य|40|1||',
  'लालेश साहू|केवटिनटोला|कांकेर|7770802019|सदस्य|41|1||',
  'चंदन मंडावी|एनहूर|दुर्गकोंदल|9302385038|सदस्य|42|1||',
  'शिवलाल नरेटी|हामतवाही|दुर्गकोंदल|8305430649|सदस्य|43|1||',
  'रोहित साहू|पुसावंड|कांकेर|6264630839|सदस्य|44|1||',
  'सीताराम साहू|परसोदा|चारामा|6260443888|सदस्य|45|1||',
  'एवन साहू|पोटगांव|कांकेर|7999557516|सदस्य|46|1||',
  'संजय साहू|कोदाभाट|कांकेर|9977238143|सदस्य|47|1||',
  'शैलेन्द्र साहू|हेटारकसा|भानुप्रतापपुर|7587824170|कोषाध्यक्ष भानु ब्लॉक|48,49|2||',
  'लोकेश्वर साहू|कुरना|कांकेर|9754692459|सदस्य|50|1||',
  'दादूराम हिरवानी|परसोदा|चारामा|9691389738|सदस्य|51|1||',
  'कमलेश रामटेके|सिलतरा|कांकेर|6264096366|सदस्य|52|1||',
  'भुनेश निषाद|पुसवाड़ा|कांकेर|6260704780|सदस्य|53|1||',
  'पुनेश्वर साहू|सेलेगांव|भानुप्रतापपुर|8319361100|सलाहकार भानु ब्लॉक|54|1||',
  'बसंत जैन|सेलेगांव|भानुप्रतापपुर|9098359804|सदस्य|55,56|2||',
  'नरेंद्र उइके|हामतवाही|दुर्गकोंदल|6264178175|सदस्य|57|1||',
  'रोहित साहू|किशनपुरी|चारामा|8839329551|उपाध्यक्ष चारामा ब्लॉक|58|1||',
  'छत्रेश जैन|सेलेगांव|भानुप्रतापपुर|7389227898|सदस्य|59|1|लोवोल|',
  'महाचंद निषाद|ढेकुना|नरहरपुर|9399273442|सदस्य|60|1||',
  'प्रदीप साहू|कुरना|कांकेर|9244322281|सदस्य|61|1||',
  'राजेश साहू|कोदाभाट|कांकेर|9755163669|सदस्य|62|1||',
  'विजय यदु|तालाकुर्रा|कांकेर|9131618122|सदस्य|63|1|कुबोटा|2024',
  'हिरदे जैन|तालाकुर्रा|कांकेर|7879911235|सलाहकार भानु ब्लॉक|64|1||',
  'राजकुमार नेताम|दमकसा|चारामा|9343710857|सदस्य|65|1||',
  'योगेंद्र सिन्हा|कोकानपुर|कांकेर|9174394378|सदस्य|66,67|2||',
  'कृष्ण जैन|रानिडोंगरी|चारामा||सदस्य|68|1|वर्धमान|2024',
  'अजय चक्रधारी|बैजनपुरी|भानुप्रतापपुर|9171549176|सलाहकार भानु ब्लॉक|69|1||',
  'बसंती नेताम|नाहगिदा|दुर्गकोंदल||सदस्य|70|1||',
  'डाकेश साहू|सिलतरा|कांकेर|6261880354|सदस्य|71|1|जॉन डियर|',
  'चंद्रशेखर साहू|अंडी|कांकेर|9165642266|सचिव भानु ब्लॉक|72|1||',
  'गुरुदयाल साहू|परसोदा|चारामा|6260127453|सलाहकार भानु ब्लॉक|73,74,75|3||',
  'रामरतन साहू|चिल्हाटी|भानुप्रतापपुर|7224017771|सदस्य|76|1||',
  'अर्जुन साहू|मोदे|कांकेर|7646873829|सदस्य|77|1||',
  'टिकेश्वर साहू|नवडबरी|नरहरपुर||सदस्य|78|1||',
  'रोहेन्द्र जैन|कोकानपुर|कांकेर|9770766979|संरक्षक भानु ब्लॉक|79,80|2||',
  'डब्बू परिहार|कोकानपुर|कांकेर|9770669955|उपाध्यक्ष भानु ब्लॉक|81,82|2||',
  'गितेश यदु|तालाकुर्रा|कांकेर|8120125496|सलाहकार भानु ब्लॉक|83|1||',
  'ब्रम्हा मरकाम|हल्बा|चारामा|8319688102|उपाध्यक्ष चारामा ब्लॉक|84|1||',
  'मनीष कटेंद्र|झिपाटोला|चारामा|7587027763|सदस्य|85,86,87,88|4|कुबोटा|',
  'देवेंद्र साहू|मुड़पार|कांकेर|9630657362|सदस्य|89,90|2|कुबोटा, वर्धमान|',
  'नीरज साहू|केवटिनटोला|चारामा|8120694471|मीडिया प्रभारी भानु ब्लॉक|91|1||',
  'मिलन दरियो|दमकसा|चारामा|9111466606|सदस्य|92|1|वर्धमान|',
  'अनिल नाग|पीढ़ापाल|कांकेर|8889080353|सदस्य|93|1||',
  'कुलेश्वर साहू|मुड़पार|कांकेर|9340781816|सदस्य|94|1||',
  'एवन साहू|मरकाटोला|कांकेर|8435381582|सदस्य|95|1||',
  'संतोष तिवारी|जामपारा, कोरर|भानुप्रतापपुर|7049865701|सलाहकार भानु ब्लॉक|96|1||',
  'रामस्वरूप साहू|ढेकुना|नरहरपुर|9340344598|सदस्य|97|1|वर्धमान|',
  'रोमन साहू|अंडी|कांकेर|6268179413|सदस्य|98|1||',
  'ढालेश्वर साहू|बाबुकोहका|चारामा|9770232303|सदस्य|99|1||',
  'बसंत समरथ|हरनपुरी|चारामा|9174394380|सदस्य|100|1||',
  'मुकेश जैन|माकड़ी|कांकेर|9691619503|सदस्य|101|1||',
  'त्रिवेश कटेंद्र|झिपाटोला|चारामा|9479084103|सदस्य|102103|2|फील्ड किंग|',
  'अकाश साहू|संबलपुर|चारामा|6268504263|सदस्य|104|1||',
  'तोमेश जैन|जेपरा|चारामा|8103186029|संयोजक चारामा ब्लॉक|105106107|3||',
  'भूपेश पोया|मयाना|चारामा|7999082527|उपाध्यक्ष चारामा ब्लॉक|108|1|वर्धमान|',
  'सुंदर लाल साहू|मुड़पार|कांकेर|9131341680|सदस्य|109|1||',
  'इंद्रजीत साहू|मुड़पार|कांकेर|7470545269|सदस्य|110|1||',
  'पुरन गंजीर|चांवड|नरहरपुर|9098534119|सदस्य|111|1|लोवोल|',
  'फुफेंद्र मंडावी|चांवड़|नरहरपुर|7828652294|सदस्य|112113|2|फील्डकिंग, कुबोटा|',
  'पीकेश्वर साहू|पुसावंड|कांकेर|8319851766|सदस्य निगरानी समिति कांकेर ब्लॉक|114|1||',
  'मनोज साहू|कुरना|कांकेर|7089880043|सदस्य निगरानी समिति कांकेर ब्लॉक|115|1||',
  'दुष्यंत साहू|कुरना|कांकेर|9399472398|सदस्य|116|1||',
  'खेमलाल सिन्हा|कुरना|कांकेर|8109129974|सदस्य|117|1||',
  'गोपाल सोनकर|चारामा|चारामा|9301863578|सदस्य|118|1||',
  'पंकज सिन्हा|पांडरवाही|कांकेर|7880202913|सदस्य निगरानी समिति कांकेर ब्लॉक|119120|2||',
  'पवन देहारी|किरगापाटी|कांकेर|9098201717|सदस्य निगरानी समिति कांकेर ब्लॉक|121|1||',
  'संदीप धुर्वा|कन्हारपुरी|कांकेर|9407916592|सदस्य|122123|2||',
  'लक्ष्मीकांत देशमुख|कोदागांव|कांकेर|6265380481|सदस्य|124125|2||',
  'नरेश गावड़े|कोदागांव|अंतागढ़|7587370317|सदस्य|126|1|महिंद्रा|',
  'कृष्णा सिन्हा|कोकपुर|कांकेर|9617472099|उपाध्यक्ष कांकेर ब्लॉक|127128|2||',
  'धर्मेन्द्र जैन|नंदनमारा|कांकेर|7987936037|सचिव कांकेर ब्लॉक|129|1||',
  'राजु जैन|नंदनमारा|कांकेर||सदस्य|130|1|वर्धमान|',
  'मोनु सोनकर|कोकपुर|कांकेर|9340670814|मीडिया प्रभारी कांकेर ब्लॉक|131132133|3||',
  'धीरज पटेल|भंडारी पारा, कांकेर|कांकेर|7999767045|कोषाध्यक्ष कांकेर ब्लॉक|134|1||',
  'मिलाप पटेल|गढ़पिछवाडी|कांकेर|9575777424|संरक्षक कांकेर ब्लॉक|135|1||',
  'डाकेश्वर नाग|कोदाभाट|कांकेर|9479251510|सदस्य निगरानी समिति कांकेर ब्लॉक|136137|2|कुबोटा|',
  'संतोष साहू|कुरना|कांकेर|7000026656|सदस्य|138|1||',
  'प्रवीण जैन|कोकड़ी|कांकेर|9238532227|सदस्य|139|1||',
  'पप्पू साहू|कोकड़ी|कांकेर|7987242142|अध्यक्ष कांकेर ब्लॉक|140|1||',
  'बसंत साहू|तेलावंट|कांकेर|9399501259|सदस्य|141|1||',
  'गोकुल परिवय|नंदनमारा|कांकेर||सदस्य|142143|2||',
  'नीरज साहू|गोतपुर|कांकेर|6261958180|सदस्य|144|1||',
  'संजय मटियारा|ठेलकाबोड|कांकेर||सदस्य|145|1||',
  'ओमप्रकाश दिवाकर|मरकाटोला,(लारगांव)|कांकेर|7587724416|सदस्य|146|1||',
  'अमन नाग|कुम्हानखार||6263367839|सदस्य|147|1||',
  'गौतम देव|बोरगांव|कांकेर|9806526858|सदस्य|148|1||',
  'राजकुमार वट्टी|सिंगारभाट|कांकेर||सदस्य|149|1||',
  'निरंजन कावड़े|पिपरौद|चारामा|7566124094|सदस्य|150|1|वीर|2025',
  'भोपाला साहु|साल्हेटोला|सरोना|8889861816|सलाहकार सरोना तहसील|151152|2||',
  'श्यामसुंदर साहु|सारवंडी|सरोना|9131314849|सचिव सरोना तहसील|153|1||',
  'यशवंत साहु|सरोना|सरोना|7587116586|सलाहकार सरोना तहसील|154155|2||',
  'हेमंत साहु|बांगाबरी|सरोना|8817005027|सदस्य|156157|2||',
  'नंदकुमार साहु|बांगाबरी|सरोना|8889443374|उपाध्यक्ष सरोना तहसील|158159|2||',
  'दीपक नायक|बांगाबरी|सरोना|8817234337|मिडिया प्रभारी सरोना तहसील|160|1||',
  'तरुण साहू|बांगाबरी|सरोना|8103462236|सदस्य|161|1||',
  'हेमलाल नाग|मांडाभर्री|सरोना|9131323853|सदस्य|162163|2||',
  'रामेश्वर सोरी|मुसुरपुट्टा|सरोना|8815153829|सलाहकार सरोना तहसील|164|1||',
  'तामेश नाग|मांडाभर्री|सरोना|9171638732|सदस्य|165|1||',
  'हेमू साहू|मावलीपारा|सरोना|9301695126|सदस्य|166|1||',
  'हीरालाल साहू|दुधावा|सरोना|9669761794|संरक्षक, सरोना तहसील|167168169|3||',
  'अंकित साहू|दुधावा|सरोना|7067149840|सदस्य|170|1||',
  'भालेन्द्र साहू|दुधावा|सरोना|6268793787|सदस्य|171|1||',
  'तिहारू राम नेताम|जामगांव|नरहरपुर|7879042940|सलाहकार सरोना तहसील|172|1||',
  'अजीत जैन|बरकई|सरोना|9977416580|सलाहकार सरोना तहसील|173|1||',
  'निरंजन साहू|दुधावा|सरोना|9131242704|जिला सलाहकार|174|1||',
  'रामसुख पटेल|देवडोंगर|नरहरपुर|9753811282|कोषाध्यक्ष सरोना तहसील|175|1||',
  'गीतेश नायक|भीरौद|||सदस्य|176|1||',
  'वासु सोरी|साल्हेभाट||8871399750|सदस्य|177|1||',
  'बिशेश्वर मरकाम|जामगांव|नरहरपुर|7489584673|सदस्य|178|1||',
  'डीगेश्वर साहू|मावलीपारा|सरोना|9340480848|सदस्य|179|2||',
  'जितेंद्र साहू|मावलीपारा|सरोना|8959744510|सदस्य|180|1||',
  'कामता प्रसाद साहू|मावलीपारा|सरोना|7697624296|जिला सलाहकार|181|1||',
  'सुदर्शन भारती|मुसुरपुट्टा|सरोना|9165134026|सदस्य|182|1||',
  'धर्मराज साहू|दलदली|सरोना|9399909169|सदस्य|183|1||',
  'योगेश पटेल|सरोना|सरोना|8602832980|सदस्य|184|1||',
  'प्रीतम साहू|दुधावा|सरोना|8839798270|सदस्य|185|1||',
  'नंदलाल साहू|दुधावा|सरोना|9669704356|सदस्य|186|1||',
  'अजीत साहू|माहुद|चारामा|7974125406|सदस्य|187|1||',
  'लिकेश्वर|बागडोंगरी|चारामा|9131695854|सदस्य|188|1|वर्धमान|2025',
  'श्यामलाल साहू|पिपरौद|चारामा|8817641822|सदस्य|189|1|वर्धमान|',
  'फागुराम साहू|कुर्रूभाट|चारामा|7724956139|निगरानी समिति चारामा ब्लॉक|190|1||',
  'विकास साहू|कुर्रूभाट|चारामा|6264261390|सदस्य|191|1||',
  'दीपक गुरुपंचायन|कुर्रूभाट|चारामा|7828272495|सचिव चारामा ब्लॉक|192|1||',
  'दुलारू राम साहू|कुर्रुभाट|चारामा|9479102241|सदस्य|193|1||',
  'विनोद साहू|कुर्रूभाट|चारामा|6265756516|सदस्य|194|1||',
  'प्रवीण गोलू नायक|कुर्रूभाट|चारामा|9753376587|सदस्य|195|1||',
  'तुकेश्वर पटेल|अरौद|चारामा|8770007912|सदस्य|196|1||',
  'अंचल प्रधान|भोथा|चारामा|7646941778|सदस्य|197|1|कुबोटा|',
  'संतु राम साहू|पेटोली|कांकेर|8103650377|जिला संरक्षक|198|1||',
  'साधुराम धनकर|पेटोली|कांकेर|9407543081|सदस्य|199|1||',
  'कुपेश्वर रामसिंग साहू|अंडी|कांकेर|9424286301|सदस्य|200|1||',
  'विमल किशोर सलाम|मरकाटोला|चारामा|7999865295|सदस्य|201|1||',
  'महेंद्र नायक|चाँवडी|चारामा|9407750687|संरक्षक चारामा ब्लॉक|202|1|वर्धमान|2024',
  'हेमंत साहू|चाँवडी|चारामा|7000047770|मीडिया प्रभारी चारामा ब्लॉक|203204|2||',
  'नेहरू कांगे|मरकाटोला|कांकेर|6264713356|सदस्य|205|1||',
  'शिवप्रसाद वट्टी|तूयेगहन|चारामा|9302361083|अध्यक्ष चारामा ब्लॉक|206|1||',
  'प्रीतम सिन्हा|तुयेगहन|चारामा|7771937119|सदस्य|207208|2||',
  'संतु राम सिन्हा|तुयेगहन|चारामा|7587419314|सदस्य|209|1||',
  'अकाश पोया|मयाना|चारामा|8251047166|सदस्य|210|1||',
  'इंद्रदेव सिन्हा|अरौद|चारामा|9770962837|सदस्य|211|1||',
  'मोमेश्वर गजेंद्र|हेटारकसा|कांकेर|6266772665|सदस्य|212|1||',
  'कार्तिक राम सिन्हा|भैंसाकट्टा|चारामा|8305699857|सदस्य|213|1||',
  'महेश्वर कुंजाम|बांडाटोला|चारामा|9098354158|सदस्य|214|1||',
  'ओमप्रकाश साहू|पुरी|चारामा|7828503942|सदस्य|215|1||',
  'गुमान साहू|पुरी|चारामा|6261475393|सदस्य|216|1||',
  'मोहन साहू|केकतीपारा|चारामा|9407945828|सदस्य|217|1|वर्धमान|',
  'तिलेश्वर साहू|अंवरी|चारामा|8839019642|सदस्य|218|1||',
  'राजेंद्र बजरंग|तेलगुडा|चारामा|9977864681|सदस्य|219|1||',
  'जीवेंद्र नायक|चांवडी|चारामा|9399683916|सदस्य|220|1|वर्धमान|',
  'दुष्यंत साहू|सिरसिदा|चारामा|6260678006|सदस्य|221|1||',
  'कामता साहू|बरकछार|चारामा||सदस्य|222|1||',
  'हेमंत यादव|भर्रीटोला|चारामा|9644627808|सदस्य|223|1||',
  'निरंजन मंडल|संबलपुर|भानुप्रतापपुर|6267788674|सदस्य|224|1||',
  'रायसिंग यादव|भीरावही|भानुप्रतापपुर|6264400592|सदस्य|225|1||',
  'नागेश साहू|मुड़खुसरा|चारामा||सदस्य|226|1||',
  'चैनसिंग साहू|अंवरी|चारामा|7828987579|सदस्य|227|1|करतार|',
  'तिलक साहू|बड़ेगौरी|चारामा|6268645356|सदस्य|228|1||',
  'कार्तिक सिन्हा|भैंसाकट्टा|चारामा|8305699857|सदस्य|229|1||',
  'कृपा राम केमरो|नरसिंगपुर|चारामा|7748896043|सदस्य|230|1||',
  'प्रेमानन्द नागवंशी|चांवड़|नरहरपुर||सदस्य|231|1||',
  'झुमेश्वर साहू|जैसाकर्रा|चारामा|9753957736|सदस्य|232|1||',
  'कैलाश साहू|बारगरी|||सदस्य|233|1||',
  'तुमेश साहू|किशनपुरी|चारामा|7803038382|सदस्य|234235|2||',
  'कृष्णा कुमार टेमरीया|पदमपुर|चारामा|6264698984|सदस्य|236|1||',
  'गंभीर कुंजाम|बांडाटोला|चारामा||सदस्य|237|1||',
  'शंभु साहू|परसोदा|चारामा||सदस्य|238239|2||',
  'सुनील कुमेटी /सौरभ कमेटी|खैरवाही|चारामा|6266661094|सदस्य|240|1|वर्धमान|2025',
  'श्यामलाल सिन्हा|तांसी|चारामा|7999968875|सदस्य|241|1||',
  'देवेंद्र साहू|अंवरी|चारामा|8719815070|सदस्य|242243244|3|वर्धमान ट्रैक्टर|',
  'बिहारी लाल महावीर|जनवानी|नरहरपुर||सदस्य|245|1||',
  'भीमराज कोसमा|कोरर|भानुप्रतापपुर|6264739097|सदस्य|246|1||',
  'ओमप्रकाश साहू|कुरना|कांकेर|7999263048|सदस्य|247|1||',
  'विक्की साहू|परसोदा|चारामा||सदस्य|248|1||',
  'सोमेन्द्र सिन्हा|डेढ़कोहका|चारामा|9174447473|सदस्य|249|1||',
  'रुद्राकांत देवांगन|चारभाटा|चारामा|9753376758|सदस्य|250|1||',
  'सहदेव सरोज|राजपुर|नरहरपुर|9111297366|सदस्य|251|1||',
  'गंभीर जैन|घोड़दा|भानुप्रतापपुर|9770992477|सदस्य|252|1||',
  'भीमराज सिन्हा|अंवरी|चारामा|8638125759|सदस्य|253254255|3|कुबोटा, वर्धमान|',
  'कीर्तन कोड़ोपी|डेढ़कोहका|चारामा|6263217539|सदस्य|256|1||',
  'तिलेश्वर साहू|अंवरी|चारामा|8839019642|सदस्य|257258259|3||',
  'कामुराम उईके|भोथा|चारामा|7049587844|सदस्य|260|1||',
  'सुरेश जैन|बरकई|सरोना|7587481173|सदस्य|261|1||',
  'आशीष देवांगन|गिरहोला|चारामा|6261360236|सदस्य|262|1||',
  'ललित सिन्हा|मुड़खुसरा|चारामा|9926520896|सदस्य|263|1||',
  'अधीर विश्वास|पीवी 126|पखांजूर|7067589955|सदस्य|264265|2||',
  'रोशन साहू|रतेसरा|चारामा|8103524654|सदस्य|266267|2||',
  'दीपक साहू|रतेसरा|चारामा|6260203443|सदस्य|268|1||',
  'शैलेन्द्र सोरी|देवगांव|नरहरपुर||सदस्य|269|1||',
  'कृष्णा बेसरा|दबेना|नरहरपुर|9691068083|सदस्य|270|1||',
  'मनकेश नाग|देवगांव|नरहरपुर|7725034102|सदस्य|271272|2||',
  'विश्वजीत शाह|पखांजूर|पखांजूर||सदस्य|273274275|3||',
  'तिलक साहू|हल्बा, बोदेली|चारामा|9827822830|सदस्य|276277|2||',
  'चित्रसेन साहू|रानिडोंगरी,|चारामा|9098306811|सदस्य|278|1|वर्धमान|',
  'नन्हेश जैन|नवडबरी|नरहरपुर|8839988750|सदस्य|279|1||',
  'कुशल मंडावी|किलेपार|चारामा|7489274846|सदस्य|280|1||',
  'राकेश गजेंद्र|जैसाकर्रा|चारामा|9407639395|कोषाध्यक्ष चारामा ब्लॉक|281282|1||',
  'जितेंद्र देवांगन|देवीनवागांव|नरहरपुर|8319949223|सदस्य|283284|2||',
  'ब्रम्हा मरकाम|हल्बा|चारामा|8319688102|उपाध्यक्ष चारामा ब्लॉक|285286|2||',
  'जितेंद्र साहू|हाराडुला|चारामा|9406027287|सदस्य|287|1|फील्ड किंग|',
  'कृष्ण कुमार जैन|रानीडोंगरी|चारामा||सदस्य|288|1||',
  'दानेश जैन|गीतपहर|चारामा|9301402915|सदस्य|289|1||',
  'रामसुमन उइके|गीतपहर|चारामा|7974423523|सदस्य|290|1||',
  'पुलकित नेताम|कसावही|चारामा|9770614649|सदस्य|291|1||',
  'वासेन्द्र साहू|भेजरीटोला|चारामा|7804088084|सदस्य|292|1||',
  'खेमचंद गंगबेर|सिलतरा|कांकेर|9406466982|सदस्य|293|1||',
  'दिनेश साहू|लखनपुरी|चारामा|8085624120|सदस्य|294|1|वर्धमान|',
  'ढालेश्वर सिन्हा|आंधेवाड़ा|दुर्गकोंदल|7804063877|सदस्य|295|1||',
  'तिलक साहू|हल्बा, बोदेली|चारामा|9827822830|सदस्य|296297|2||',
  'भीखम कांगे|साल्हेटोला|चारामा|7587281722|सदस्य|298299|2|महिंद्रा बलकार, कुबोटा|',
  'संजय विश्वास|पीवी 32 पखांजूर|पखांजूर|9131598930|सदस्य|300|1||',
  'जितेंद्र कोड़ोपी|किरगोली|कांकेर|7987499396|सदस्य|301|1||',
  'मेघु पुड़ो|पचांगी|दुर्गकोंदल|9691824767|सदस्य|302|1||',
  'उमाकांत जैन|ठेलकाबोड|कांकेर|7725808036|सदस्य|303|1||',
  'नेकराम सिन्हा|नारा|कांकेर|8349660858|सदस्य|304|1||',
  'श्यामलाल कुमेटी|आंखीहर्रा|नरहरपुर|7987123396|सदस्य|305|1||',
  'अगेश्वर सोनवानी|बैजनपुरी|भानुप्रतापपुर|9171549350|सदस्य|306|1||',
  'जीवनलाल केमरो|बैजनपुरी|भानुप्रतापपुर|9424286425|सदस्य|307|1||',
  'डीगेश्वर उइके|मुड़डोंगरी|कांकेर|7587823643|सदस्य|308|1||वीर',
  'अविनाश कोड़ोपी|चिनौरी|चारामा|9589131294|सदस्य|309|1|लोवोल|2026',
  'कौशल मंडावी|चिनौरी|चारामा|9131466950|सदस्य|310|1|वर्धमान|',
  'ईश्वर गावड़े|बोदेली|चारामा|6264133076|सदस्य|311|1|वीर|',
  'हिरदे नेताम|दुर्गाटोला, गीतपहर|चारामा|8815713057|सदस्य|312|1||',
  'अविनाश सोरी|तारसगांव|चारामा|8103151936|सदस्य|313|1||',
  'अजय सोरी|अरौद|चारामा|7489733302|सदस्य|314315|2|वीर, वर्धमान|',
  'उमेश साहू|बाबुदबेना|कांकेर|7974267077|सदस्य|316|1|फील्ड किंग|',
  'परतों मंडल|पीवी 6 कापसी|पखांजूर|9407750567|सदस्य|317|1||',
  'वेदनारायण साहू|हाटकोंगेरा|कांकेर|9238178927|सदस्य|318319320|3||',
  'चंदन कोरेटी|कुलगांव|कांकेर|7987394258|सदस्य|321322|2||',
  'ब्रम्हा सिन्हा|नारा|कांकेर|9691516828|संरक्षक कांकेर ब्लॉक|323324|2||',
  'सुरेन्द्र साहू|पुसावंड|कांकेर|9340084359|सदस्य|325|1|अर्जुन बलकार|',
  'गंगाराम निषाद|दशपुर|कांकेर|8889854793|सदस्य|326|1||',
  'विनय साहू|पटौद|कांकेर|9340349689|सदस्य|327|1||',
  'प्रवीण नाग|बरदेभाट, कांकेर|कांकेर|9131399141|जिला सलाहकार|नहीं मिला है|||',
  'खेमू साहू|दुधावा|सरोना|6268793787|अध्यक्ष सरोना तहसील|170171|||',
  'शीतल साहू|हाराडुला|चारामा|6260091701|सदस्य|नहीं मिला है|1|कुबोटा|',
  'राजेश साहू|हाराडुला|चारामा|9340204909|सदस्य|नहीं मिला है|1||',
  'विनोद ध्रुव|करियापहर|नरहरपुर|9827719639|सदस्य|नहीं मिला है|1||',
  'चंद्रहास वट्टी|कोचवाही|नरहरपुर||सदस्य|नहीं मिला है|1||',
  'छन्नू राम बघेल|उड़कुडा|चारामा|9238028174|सदस्य|नहीं मिला है|1|कुबोटा|',
  'मोनेश कुमार साहू|बिरनपुर|नरहरपुर|6261655181|सदस्य|नहीं मिला है|1||',
  'जागेश सिन्हा|डूमरपानी|चारामा|7999423908|सदस्य|नहीं मिला है|1||',
  'अशोक साहू|कोदागांव|कांकेर|9407748740|सदस्य|नहीं मिला है|1|Zoomline|',
  'अमित मंडल|भैंसाकन्हार|भानुप्रतापपुर|9770384334|सदस्य|नहीं मिला है|1||',
  'राधेश्याम निषाद|टंहकापार|चारामा|9340281835|सदस्य|नहीं मिला है|2|Zoomline|',
  'जयंत सिन्हा|रतेसरा|चारामा|7354974037|सलाहकार चारामा ब्लॉक|नहीं मिला है|2|वर्धमान, जॉन डियर W 50|',
  'जितेंद्र साहू|बागडोंगरी|चारामा|9340442328|सदस्य|नहीं मिला है|1|वर्धमान|',
  'दुष्यंत नाग|चिनौरी|चारामा|8770777415|सदस्य|नहीं मिला है|1|कुबोटा|',
  'दीपक साहू|कुर्रूभाट|चारामा|9617197920|सदस्य|नहीं मिला है|1||',
  'चंद्रशेखर साहू|कुर्रूभाट|चारामा|7746999193|सदस्य|नहीं मिला है|1||',
  'चिंता राम वार्डे|डुमरपानी|नरहरपुर|9244354310|सदस्य|नहीं मिला है|1||',
  'देवव्रत गंजीर|कुरना|कांकेर|8965967442|सदस्य|नहीं मिला है|2||',
  'भूपेंद्र साहू|कुर्रूभाट|चारामा|9098495299|सदस्य|नहीं मिला है|2||',
  'प्रमोद साहू||सरोना||सदस्य|नहीं मिला है|1||',
  'कैलाश पटेल||सरोना||सदस्य|नहीं मिला है|1||',
  'चिंताराम सिन्हा||सरोना||सदस्य|नहीं मिला है|1||',
  'गणेश यादव||सरोना||सदस्य|नहीं मिला है|1||',
  'समीरन गोलदार|पीवी 25|पखांजूर|6267051018|सदस्य|नहीं मिला है|1||',
  'दीपक मंडावी|नाथियानवागांव|कांकेर|9340320664|सदस्य|346|1|वर्धमान|',
  'सुरेश पटेल|रिशेवाड़ा|नरहरपुर|9907059512|सदस्य|347348|1||',
  'दुलेश्वर जैन|भीरावही|कांकेर|9406150832|सदस्य|349350|2|करतार|20182022',
  'राकेश साहू|भावगीर, नवागांव|कांकेर|6265675107|सदस्य|नहीं मिला है|1||',
  'भुनेश्वर गजेंद्र|जैसाकर्रा|चारामा|6264374951|सदस्य|नहीं मिला है|1||',
  'जयपाल ठाकुर|कुरालठेमली|नरहरपुर||सदस्य|नहीं मिला है|1||',
  'अनिल नेताम|इमलीपारा, जामगांव|नरहरपुर||सदस्य|नहीं मिला है|1||',
  'मलखम नेताम|इमलीपारा, जामगांव|नरहरपुर||सदस्य|नहीं मिला है|1||',
  'हजारी कटेंद्र|चिनौरी|चारामा|9406039505|सदस्य|नहीं मिला है||कुबोटा|',
  'शेखर सलाम|झिपाटोला|चारामा|7828777092|सदस्य नहीं है C||1|वर्धमान|2026',
  'अगेश निषाद|कोदागांव|कांकेर|9303041915|सदस्य नहीं है K||||',
  'अजय कुंजाम|कोदागांव|कांकेर|6265008510|सदस्य|नहीं मिला है|1||',
  'सोनू अकाश नायक|बांगाबरी|सरोना|6268668959|सदस्य|नहीं मिला है|1|वर्धमान|',
  'पवन प्रधान|छापरपारा|सरोना|9993810715|सदस्य|नहीं मिला है|1||',
  'भानु उसेंडी|ज्वरतरा|चारामा|6266057668|सदस्य|नहीं मिला है|1|लोवोल|2026',
  'लोकनाथ भोयर|भानुप्रतापपुर|भानुप्रतापपुर|9406423375|सदस्य|नहीं मिला है|2||',
  'परिमल मिस्त्री|पीवी 22 पखांजूर|पखांजूर|9301203536|सदस्य|नहीं मिला है|2||',
  'भावेन हाजरा|पीवी 22 पखांजूर|पखांजूर|6266973592|सदस्य|नहीं मिला है|2||',
  'दीनू साहू|ज्वरतरा|चारामा|7974343121|सदस्य|नहीं मिला है|1|सिल्वर|2026',
  'देवप्रसाद दर्रो|भेजा|भानुप्रतापपुर|7879438663|सदस्य|नहीं मिला है|1|वर्धमान|2026',
  'मदन लाल साहू|बागडोंगरी|चारामा|9179976328|सदस्य|नहीं मिला है|1|वर्धमान|',
  'धर्मेंद्र साहू|केकतीपारा|चारामा|6261728225|सदस्य|217||वर्धमान|',
  'देवेंद्र साहू|डुमरपानी|नरहरपुर|8719826465|सदस्य|नहीं मिला है|1||',
  'भूपेंद्र पीदा|कोदागांव|कांकेर|9098545184|सदस्य|नहीं मिला है|1||',
  'नागेंद्र नेताम|कोटतरा|चारामा|6268795640|सदस्य|नहीं मिला है|1||',
  'संत कुमार साहू|अंवरी|चारामा|9406041528|एजेंट|नहीं मिला है|||',
  'नरेश जैन|कोकड़ी|कांकेर|9131181773|सदस्य|नहीं मिला है|1||',
  'यज्ञ साहू|परसोदा|चारामा|6260763178|सदस्य|नहीं मिला है|2||',
  'अमित मंडावी|ऐसेबेड़ा|दुर्गूकोंदल|6266763540|सदस्य|नहीं मिला है|1||',
  'नीरज देवांगन|गिरहोला/चारभाटा|चारामा|9340741248|सदस्य|250|||',
  'अशोक मंडावी|कोमलपुर|कांकेर|9131406238|सदस्य|नहीं मिला है|1||',
  'तुकाराम साहू|कोकानपुर|चारामा||सदस्य|नहीं मिला है|1|ACE|',
  'चंद्रकांत सोरी|कोटेला|चारामा|8319424789|सदस्य|नहीं मिला है|1|लोवोल|2026',
  'राजा ठाकुर|बागोड़||7999083738|सदस्य|नहीं मिला है|1||',
  'संतराम सार्वा|||6264013098|सदस्य|नहीं मिला है|1||',
  'जयराम कोड़ोपी|सरंगपाल|कांकेर|7770925523|सदस्य|नहीं मिला है|1||',
  'गैंदलाल साहू|महेशपुर|नरहरपुर|6261894900|सदस्य|नहीं मिला है|3||',
  'समीर साहू|दुधावा|सरोना|9244249557|सदस्य|नहीं मिला है|1||',
  'मेहर राम जैन|मुड़पार|कांकेर|9399496147|सदस्य|नहीं मिला है|1||',
  'पंकज साहू|बागोडार|कांकेर|9340615938|सदस्य|नहीं मिला है|1||',
  'आनंद दर्रो|आंखीहर्रा|नरहरपुर||सदस्य|नहीं मिला है|1||',
  'शंकर लाल यादव|कोरर|भानुप्रतापपुर|9303655499|जिला सलाहकार|16,17,18|||',
];

function parseSeedMembers(): any[] {
  return SEED_MEMBERS.map((line, idx) => {
    const p = line.split('|');
    const f = (i: number) => (p[i] || '').trim();
    return {
      id: 'seed-' + idx + '-' + Date.now().toString(36),
      name: f(0), pata: f(1), block: f(2), jila: 'कांकेर', rajya: 'छत्तीसगढ़',
      mobile: f(3), pad: f(4) || 'सदस्य', harvesterNumber: f(5),
      sadasyataShulk: '500', bhugtanTarikh: '', bhugtanMadhyam: 'नकद',
      rashiPraptakarta: '', gadiSankhya: f(6), company: f(7), model: f(8),
      anyaJankari: 'मास्टर डेटा से स्वतः जोड़ा गया'
    };
  });
}
// ============================================================================

const MENU = [
  {title:'सदस्य',color:'#6ABF69',key:'members'},
  {title:'किसान',color:'#F5A623',key:'kisan'},
  {title:'एजेंट',color:'#5AC8FA',key:'agent'},
  {title:'ऑपरेटर',color:'#9B7ED8',key:'operator'},
  {title:'हेल्पर',color:'#E94E6B',key:'helper'},
  {title:'डीलर',color:'#A07C6D',key:'dealer'},
  {title:'पार्ट्स विक्रेता',color:'#4DB6AC',key:'parts'},
  {title:'सूचना / नोटिस',color:'#B07BE6',key:'notice'},
  {title:'लॉग आउट',color:'#212121',key:'logout'},
];
const HINDI: any = {
 members: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',pad:'पद',harvesterNumber:'हार्वेस्टर मोनो नंबर',sadasyataShulk:'सदस्यता शुल्क',bhugtanTarikh:'भुगतान की तारीख',bhugtanMadhyam:'भुगतान माध्यम',rashiPraptakarta:'राशि प्राप्तकर्ता',gadiSankhya:'गाड़ी संख्या',company:'कंपनी',model:'मॉडल',anyaJankari:'अन्य जानकारी'},
 kisan: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',fasal:'फसल',ekad:'एकड़',kataiTarikh:'फसल कटाई की तारीख',samay:'समय',totalGhanta:'टोटल घंटा/समय',totalKaryadivas:'टोटल कार्यदिवस',advanceRashi:'एडवांस राशि जमा',bachatRashi:'बचत राशि',pooraRashi:'पूरा राशि जमा',anyaJankari:'अन्य जानकारी'},
 agent: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',agreement:'एग्रीमेंट',check:'चेक',karyadivas:'कार्यदिवस',totalGhanta:'टोटल घंटा/समय',advanceRashi:'एडवांस राशि प्राप्त',bachatRashi:'बचत राशि',pooraRashi:'पूरा राशि प्राप्त',anyaJankari:'अन्य जानकारी'},
 operator: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',karyPrarambhTithi:'कार्य प्रारंभ तिथि',karySamaptiTithi:'कार्य समाप्ति तिथि',dailyMajduri:'प्रतिदिन मजदूरी राशि',anyaJankari:'अन्य जानकारी',totalKaryadivas:'टोटल कार्यदिवस',upasthiti:'उपस्थिति तिथियां',bachatRashi:'बचत राशि',totalRashi:'टोटल राशि'},
 helper: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',karyPrarambhTithi:'कार्य प्रारंभ तिथि',karySamaptiTithi:'कार्य समाप्ति तिथि',dailyMajduri:'प्रतिदिन मजदूरी राशि',anyaJankari:'अन्य जानकारी',totalKaryadivas:'टोटल कार्यदिवस',upasthiti:'उपस्थिति तिथियां',bachatRashi:'बचत राशि',totalRashi:'टोटल राशि'},
 dealer: {name:'नाम *',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',company:'कंपनी',showroomPata:'शोरूम पता',serviceCenter:'सर्विस सेंटर',anyaJankari:'अन्य जानकारी'},
 parts: {name:'नाम *',dukaanNaam:'दुकान का नाम',pata:'पता',block:'ब्लॉक',jila:'जिला',rajya:'राज्य',mobile:'मोबाइल नंबर *',partsPrakar:'पार्ट्स प्रकार',anyaJankari:'अन्य जानकारी'},
 notice: {vishay:'विषय *',tarikh:'तारीख',vivaran:'विवरण',mobile:'मोबाइल नंबर',anyaJankari:'अन्य जानकारी'}
};
const FULL: any = {
 members: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',pad:'सदस्य',harvesterNumber:'',sadasyataShulk:'500',bhugtanTarikh:'',bhugtanMadhyam:'नकद',rashiPraptakarta:'',gadiSankhya:'',company:'',model:'',anyaJankari:''},
 kisan: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',fasal:'धान',ekad:'',kataiTarikh:'',samay:'',totalGhanta:'',totalKaryadivas:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:'',advanceList:[],fasalList:[]},
 agent: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',agreement:'',check:'',karyadivas:'',totalGhanta:'',advanceRashi:'',bachatRashi:'',pooraRashi:'',anyaJankari:''},
 operator: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',karyPrarambhTithi:'',karySamaptiTithi:'',dailyMajduri:'',anyaJankari:'',totalKaryadivas:'',upasthiti:'',upasthitiDates:[],advance:'',bachatRashi:'',totalRashi:'',advanceList:[]},
 helper: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',karyPrarambhTithi:'',karySamaptiTithi:'',dailyMajduri:'',anyaJankari:'',totalKaryadivas:'',upasthiti:'',upasthitiDates:[],advanceRashi:'',bachatRashi:'',totalRashi:'',advanceList:[]},
 dealer: {name:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',company:'',showroomPata:'',serviceCenter:'',anyaJankari:''},
 parts: {name:'',dukaanNaam:'',pata:'',block:'',jila:'कांकेर',rajya:'छत्तीसगढ़',mobile:'',partsPrakar:'',anyaJankari:''},
 notice: {vishay:'',tarikh:'',vivaran:'',mobile:'',anyaJankari:''}
};

// किसान घंटा-मिनट सिस्टम : 2.35 = 2 घंटा 35 मिनट
function ghantaToMinute(val:any): number {
  if(val===null||val===undefined||val==='') return 0;
  const s=String(val).trim();
  if(s.indexOf('.')===-1){
    const h=parseInt(s,10)||0;
    return h*60;
  }
  const parts=s.split('.');
  const h=parseInt(parts[0]||'0',10)||0;
  const mStr=(parts[1]||'').slice(0,2);
  const m=parseInt(mStr||'0',10)||0;
  return h*60+m;
}
function minuteToGhantaText(totalMin:number): string {
  const h=Math.floor(totalMin/60);
  const m=totalMin%60;
  return h+' घंटा '+m+' मिनट';
}

// सर्च के लिए टेक्स्ट को सामान्य बनाएं (स्पेस, कॉमा, डैश हटाकर)
function norm(s:any): string {
  return String(s==null?'':s).toLowerCase().replace(/[\s,\-]/g,'');
}

function getUpasthitiDates(item:any): string[] {
  if(!item) return [];
  if(Array.isArray(item.upasthitiDates)) return item.upasthitiDates;
  if(item.upasthiti && typeof item.upasthiti==='string' && item.upasthiti.trim()!==''){
    return item.upasthiti.split(',').map((s:string)=>s.trim()).filter((s:string)=>s!=='');
  }
  return [];
}
function getAdvanceList(item:any): any[] {
  if(!item) return [];
  if(Array.isArray(item.advanceList)) return item.advanceList;
  return [];
}
function getFasalList(item:any): any[] {
  if(!item) return [];
  if(Array.isArray(item.fasalList) && item.fasalList.length>0) return item.fasalList;
  if(item.kataiTarikh || item.samay || item.ekad || item.totalGhanta){
    const t=(item.kataiTarikh||'').trim(); const s=(item.samay||'').trim(); const e=(item.ekad||'').trim(); const g=(item.totalGhanta||'').trim();
    if(t||s||e||g) return [{date:t,samay:s,ekad:e,ghanta:g}];
  }
  return [];
}
function getFasalGhantaTotal(item:any): string {
  const list=getFasalList(item);
  let totalMin=0;
  list.forEach((e:any)=>{ totalMin+=ghantaToMinute(e.ghanta); });
  return minuteToGhantaText(totalMin);
}
function getAdvanceTotal(f:any, t:string): number {
  const list=getAdvanceList(f);
  let sum=list.reduce((s:any,e:any)=>s+(parseFloat(e.amount)||0),0);
  if(sum===0){
    const advKey=t==='operator'?'advance':'advanceRashi';
    sum=parseFloat(f[advKey]||'0')||0;
  }
  return sum;
}
function calcTotalRashi(f:any, t:string): string {
  const a=getAdvanceTotal(f,t);
  const b=parseFloat(f['bachatRashi']||'0')||0;
  return String(a+b);
}
function calcKisanTotal(f:any): string { return calcTotalRashi(f,'kisan'); }
const BOTTOM_KEYS = ['totalKaryadivas','upasthiti','upasthitiDates','advance','advanceRashi','bachatRashi','totalRashi','pooraRashi','advanceList','ekad','kataiTarikh','samay','totalGhanta','fasalList'];
const KISAN_BOTTOM = ['advanceRashi','bachatRashi','pooraRashi','advanceList'];
const KISAN_FASAL_KEYS = ['ekad','kataiTarikh','samay','totalGhanta','fasalList'];

export default function App(){
  const [view,setView]=useState('home');
  const [members,setMembers]=useState<any[]>([]); const [kisans,setKisans]=useState<any[]>([]); const [agents,setAgents]=useState<any[]>([]); const [operators,setOperators]=useState<any[]>([]); const [helpers,setHelpers]=useState<any[]>([]); const [dealers,setDealers]=useState<any[]>([]); const [parts,setParts]=useState<any[]>([]); const [notices,setNotices]=useState<any[]>([]);
  const [form,setForm]=useState<any>({}); const [show,setShow]=useState(false); const [type,setType]=useState('members'); const [editId,setEditId]=useState<string|null>(null);
  const [search,setSearch]=useState(''); const [splash,setSplash]=useState(true);
  const [progress,setProgress]=useState(0);
  const [isLogin,setIsLogin]=useState(false); const [pass,setPass]=useState('');
  const [loaded,setLoaded]=useState(false);
  const [detailItem,setDetailItem]=useState<any|null>(null);
  const [newDate,setNewDate]=useState('');
  const [advDate,setAdvDate]=useState(''); const [advAmt,setAdvAmt]=useState('');
  const [fasalDate,setFasalDate]=useState(''); const [fasalSamay,setFasalSamay]=useState(''); const [fasalEkad,setFasalEkad]=useState(''); const [fasalGhanta,setFasalGhanta]=useState('');

  // ===== पहली बार ऐप खुलने पर मास्टर डेटा के 329 सदस्य स्वतः सेव होंगे =====
  // आपका पुराना डेटा कभी नहीं मिटेगा - यह सिर्फ पहली बार चलता है
  // (पुरानी खाली लिस्ट होने पर भी सीड होगा, ताकि 329 नाम जरूर दिखें)
  useEffect(()=>{ (async()=>{ try{
    const m=await AsyncStorage.getItem('members');
    const seeded=await AsyncStorage.getItem('members_seeded');
    let saved:any[]=[];
    try{ saved=m?JSON.parse(m):[]; }catch(e){ saved=[]; }
    if(saved.length>0){
      setMembers(saved);
    } else if(seeded!=='yes'){
      const seedList=parseSeedMembers();
      setMembers(seedList);
      await AsyncStorage.setItem('members',JSON.stringify(seedList));
      await AsyncStorage.setItem('members_seeded','yes');
    }
    const k=await AsyncStorage.getItem('kisans'); if(k) setKisans(JSON.parse(k));
    const a=await AsyncStorage.getItem('agents'); if(a) setAgents(JSON.parse(a));
    const o=await AsyncStorage.getItem('operators'); if(o) setOperators(JSON.parse(o));
    const h=await AsyncStorage.getItem('helpers'); if(h) setHelpers(JSON.parse(h));
    const d=await AsyncStorage.getItem('dealers'); if(d) setDealers(JSON.parse(d));
    const p=await AsyncStorage.getItem('parts'); if(p) setParts(JSON.parse(p));
    const n=await AsyncStorage.getItem('notices'); if(n) setNotices(JSON.parse(n));
    const lg=await AsyncStorage.getItem('isLogin'); if(lg==='yes') setIsLogin(true);
  }catch(e){} setLoaded(true); })(); },[]);
  useEffect(()=>{ let val=0; const interval=setInterval(()=>{ val+=1; if(val>=100){ val=100; clearInterval(interval); setTimeout(()=>setSplash(false),500); } setProgress(val); },100); return ()=>clearInterval(interval); },[]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('members',JSON.stringify(members)); },[members,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('kisans',JSON.stringify(kisans)); },[kisans,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('agents',JSON.stringify(agents)); },[agents,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('operators',JSON.stringify(operators)); },[operators,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('helpers',JSON.stringify(helpers)); },[helpers,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('dealers',JSON.stringify(dealers)); },[dealers,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('parts',JSON.stringify(parts)); },[parts,loaded]);
  useEffect(()=>{ if(!loaded) return; AsyncStorage.setItem('notices',JSON.stringify(notices)); },[notices,loaded]);
  useEffect(()=>{ const onBackPress=()=>{ if(detailItem){setDetailItem(null);return true;} if(show){setShow(false);return true;} if(view!=='home'){setView('home');return true;} if(isLogin&&view==='home'){AsyncStorage.setItem('isLogin','no');setIsLogin(false);return true;} return false; }; const sub=BackHandler.addEventListener('hardwareBackPress',onBackPress); return ()=>sub.remove(); },[view,show,isLogin,detailItem]);

  const doLogin=async()=>{ if(pass==='2022'){ setIsLogin(true); await AsyncStorage.setItem('isLogin','yes'); setPass(''); } else alert('गलत पासवर्ड!'); };
  const doLogout=async()=>{ await AsyncStorage.setItem('isLogin','no'); setIsLogin(false); setView('home'); };
  const openForm=(t:string,item:any)=>{ setType(t); setEditId(item?item.id:null); const base=FULL[t]||{}; const merged=item?Object.assign({},JSON.parse(JSON.stringify(base)),item):JSON.parse(JSON.stringify(base)); if((t==='operator'||t==='helper')){ merged.upasthitiDates=getUpasthitiDates(merged); merged.advanceList=getAdvanceList(merged); merged.totalRashi=calcTotalRashi(merged,t); merged.totalKaryadivas=String(getUpasthitiDates(merged).length); } if(t==='kisan'){ merged.advanceList=getAdvanceList(merged); merged.fasalList=getFasalList(merged); merged.pooraRashi=calcKisanTotal(merged); } setForm(merged); setNewDate(''); setAdvDate(''); setAdvAmt(''); setFasalDate(''); setFasalSamay(''); setFasalEkad(''); setFasalGhanta(''); setShow(true); };
  const updateFormField=(k:string,t:string)=>{ const nf={...form,[k]:t}; if((type==='operator'||type==='helper')&&k==='bachatRashi'){ nf.totalRashi=calcTotalRashi(nf,type); } if(type==='kisan'&&k==='bachatRashi'){ nf.pooraRashi=calcKisanTotal(nf); } setForm(nf); };
  const addUpasthitiDate=()=>{ const d=newDate.trim(); if(!d){alert('पहले तारीख लिखें');return;} const cur:Array<string>=Array.isArray(form.upasthitiDates)?form.upasthitiDates:[]; if(cur.includes(d)){alert('यह तारीख पहले से जुड़ी है');return;} const updated=[...cur,d]; setForm({...form,upasthitiDates:updated,upasthiti:updated.join(', '),totalKaryadivas:String(updated.length)}); setNewDate(''); };
  const removeUpasthitiDate=(d:string)=>{ const cur:Array<string>=Array.isArray(form.upasthitiDates)?form.upasthitiDates:[]; const updated=cur.filter(x=>x!==d); setForm({...form,upasthitiDates:updated,upasthiti:updated.join(', '),totalKaryadivas:String(updated.length)}); };
  const addAdvanceEntry=()=>{ const d=advDate.trim(); const a=advAmt.trim(); if(!d){alert('एडवांस की तारीख लिखें');return;} if(!a){alert('एडवांस राशि लिखें');return;} const cur=getAdvanceList(form); const updated=[...cur,{date:d,amount:a}]; const nf={...form,advanceList:updated}; if(type==='kisan'){ nf.pooraRashi=calcKisanTotal(nf); } else { nf.totalRashi=calcTotalRashi(nf,type); } setForm(nf); setAdvDate(''); setAdvAmt(''); };
  const removeAdvanceEntry=(idx:number)=>{ const cur=getAdvanceList(form); const updated=cur.filter((_:any,i:number)=>i!==idx); const nf={...form,advanceList:updated}; if(type==='kisan'){ nf.pooraRashi=calcKisanTotal(nf); } else { nf.totalRashi=calcTotalRashi(nf,type); } setForm(nf); };
  const addFasalEntry=()=>{ const d=fasalDate.trim(); const sm=fasalSamay.trim(); const ek=fasalEkad.trim(); const gh=fasalGhanta.trim(); if(!d){alert('फसल कटाई की तारीख लिखें');return;} if(!sm){alert('समय लिखें');return;} if(!ek){alert('एकड़ लिखें');return;} if(!gh){alert('घंटा लिखें');return;} const cur=getFasalList(form); const updated=[...cur,{date:d,samay:sm,ekad:ek,ghanta:gh}]; setForm({...form,fasalList:updated}); setFasalDate(''); setFasalSamay(''); setFasalEkad(''); setFasalGhanta(''); };
  const removeFasalEntry=(idx:number)=>{ const cur=getFasalList(form); const updated=cur.filter((_:any,i:number)=>i!==idx); setForm({...form,fasalList:updated}); };
  const save=()=>{ const id=editId||Date.now().toString(); const data=Object.assign({},form,{id}); if((type==='operator'||type==='helper')){ const dates=getUpasthitiDates(data); data.upasthitiDates=dates; data.upasthiti=dates.join(', '); data.totalKaryadivas=String(dates.length); data.advanceList=getAdvanceList(data); data.totalRashi=calcTotalRashi(data,type); } if(type==='kisan'){ data.advanceList=getAdvanceList(data); data.fasalList=getFasalList(data); if(data.fasalList.length>0){ const last=data.fasalList[data.fasalList.length-1]; data.kataiTarikh=last.date||''; data.samay=last.samay||''; data.ekad=last.ekad||''; } data.totalGhanta=getFasalGhantaTotal(data); data.pooraRashi=calcKisanTotal(data); } if(type==='members') setMembers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='kisan') setKisans(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='agent') setAgents(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='operator') setOperators(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='helper') setHelpers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='dealer') setDealers(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='parts') setParts(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); if(type==='notice') setNotices(p=>editId?p.map(x=>x.id===editId?data:x):[data,...p]); setShow(false); };

  // ===== सर्च: नाम, पता, ब्लॉक, मोबाइल नंबर, मोनो नंबर (स्पेस हटाकर) =====
  const getList=()=>{
    let l:any[]=[];
    if(type==='members') l=members; else if(type==='kisan') l=kisans; else if(type==='agent') l=agents; else if(type==='operator') l=operators; else if(type==='helper') l=helpers; else if(type==='dealer') l=dealers; else if(type==='parts') l=parts; else l=notices;
    if(search){
      const q=norm(search);
      const qDigits=q.replace(/\D/g,'');
      return l.filter(it=>{
        const fields=[it.name,it.vishay,it.pata,it.block,it.jila,it.mobile,it.harvesterNumber,it.pad,it.company,it.model,it.gadiSankhya];
        if(norm(fields.join(' ')).includes(q)) return true;
        if(qDigits.length>=2){
          const mobDigits=String(it.mobile||'').replace(/\D/g,'');
          if(mobDigits.includes(qDigits)) return true;
          if(type==='members'&&it.harvesterNumber){
            const monoDigits=String(it.harvesterNumber).replace(/\D/g,'');
            if(monoDigits&&monoDigits.includes(qDigits)) return true;
          }
        }
        return false;
      });
    }
    return l;
  };

  // ===== कुल संख्या (बिना सर्च फिल्टर) =====
  const getTotal=()=>{
    if(type==='members') return members.length;
    if(type==='kisan') return kisans.length;
    if(type==='agent') return agents.length;
    if(type==='operator') return operators.length;
    if(type==='helper') return helpers.length;
    if(type==='dealer') return dealers.length;
    if(type==='parts') return parts.length;
    return notices.length;
  };

  // ===== तेज लिस्ट: FlatList एक बार में सिर्फ दिखने वाले कार्ड बनाता है, इसलिए 329 सदस्य भी फास्ट चलेंगे =====
  const renderCard=({item:it}:{item:any})=>{
    const dts=getUpasthitiDates(it); const advT=getAdvanceTotal(it,type); const fList=getFasalList(it);
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={()=>setDetailItem(it)}>
      <View style={s.card}><Text style={{fontWeight:'bold',fontSize:16,color:'#0D47A1'}}>{it.name||it.vishay} 👁️</Text><Text>{it.mobile||''} {it.pata||''}</Text>
      {type==='members' && it.harvesterNumber? <Text style={{fontSize:13,fontWeight:'bold',color:'#6A1B9A',marginTop:4}}>🔖 मोनो नंबर: {it.harvesterNumber}</Text> : null}
      {(type==='operator'||type==='helper')? <Text style={{fontSize:13,fontWeight:'bold',color:'#1B5E20',marginTop:4}}>✅ कार्यदिवस: {dts.length} दिन | एडवांस: ₹{advT} | टोटल: ₹{it.totalRashi||calcTotalRashi(it,type)}</Text> : null}
      {type==='kisan'? <Text style={{fontSize:13,fontWeight:'bold',color:'#2E7D32',marginTop:4}}>🌾 कटाई: {fList.length} प्रविष्टि | टोटल घंटा: {getFasalGhantaTotal(it)} | 💰 एडवांस: ₹{advT} | पूरा: ₹{it.pooraRashi||calcKisanTotal(it)}</Text> : null}
      <Text style={{fontSize:11,color:'#888',marginTop:4}}>पूरी जानकारी देखने के लिए क्लिक करें</Text>
      {it.mobile? (<View style={{flexDirection:'row',marginTop:10,flexWrap:'wrap'}}><TouchableOpacity style={[s.sm,{backgroundColor:'#4CAF50'}]} onPress={()=>Linking.openURL(`tel:${it.mobile}`)}><Text style={s.smT}>📞 कॉल</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#128C7E'}]} onPress={()=>Linking.openURL(`https://wa.me/91${it.mobile.toString().replace(/\D/g,'').slice(-10)}`)}><Text style={s.smT}>🟢 व्हाट्सएप</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#2196F3'}]} onPress={()=>Linking.openURL(`sms:${it.mobile}`)}><Text style={s.smT}>✉️ मैसेज</Text></TouchableOpacity></View>) : null}
      <View style={{flexDirection:'row',marginTop:8,flexWrap:'wrap'}}><TouchableOpacity style={[s.sm,{backgroundColor:'#FF9800'}]} onPress={()=>openForm(type,it)}><Text style={s.smT}>✏️ एडिट करें</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#D32F2F'}]} onPress={()=>{ if(type==='members') setMembers(p=>p.filter(x=>x.id!==it.id)); if(type==='kisan') setKisans(p=>p.filter(x=>x.id!==it.id)); if(type==='agent') setAgents(p=>p.filter(x=>x.id!==it.id)); if(type==='operator') setOperators(p=>p.filter(x=>x.id!==it.id)); if(type==='helper') setHelpers(p=>p.filter(x=>x.id!==it.id)); if(type==='dealer') setDealers(p=>p.filter(x=>x.id!==it.id)); if(type==='parts') setParts(p=>p.filter(x=>x.id!==it.id)); if(type==='notice') setNotices(p=>p.filter(x=>x.id!==it.id)); }}><Text style={s.smT}>🗑️ डिलीट</Text></TouchableOpacity></View></View>
      </TouchableOpacity>
    );
  };

  const renderKisanFasalSection=()=>{
    if(type!=='kisan') return null;
    const list=getFasalList(form);
    const ghText=getFasalGhantaTotal(form);
    return (
      <View style={{marginTop:12,backgroundColor:'#E8F5E9',padding:12,borderRadius:10,borderWidth:2,borderColor:'#2E7D32'}}>
        <Text style={{fontSize:15,fontWeight:'900',color:'#1B5E20',textAlign:'center'}}>🌾 फसल कटाई - तिथि / समय / एकड़ / घंटा</Text>
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>कटाई विवरण - टोटल: {list.length} प्रविष्टि | टोटल घंटा: {ghText}</Text>
        <View style={{flexDirection:'row',marginTop:6}}>
          <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={fasalDate} onChangeText={setFasalDate} placeholder="तिथि जैसे 07/09/2026" />
          <TextInput style={[s.inp,{flex:1,marginTop:0,marginLeft:6}]} value={fasalSamay} onChangeText={setFasalSamay} placeholder="समय" />
        </View>
        <View style={{flexDirection:'row',marginTop:6}}>
          <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={fasalEkad} onChangeText={setFasalEkad} placeholder="एकड़" keyboardType="numeric" />
          <TextInput style={[s.inp,{flex:1,marginTop:0,marginLeft:6}]} value={fasalGhanta} onChangeText={setFasalGhanta} placeholder="घंटा" keyboardType="numeric" />
        </View>
        <TouchableOpacity style={{backgroundColor:'#2E7D32',padding:10,borderRadius:8,marginTop:8,alignItems:'center'}} onPress={addFasalEntry}><Text style={{color:'#fff',fontWeight:'bold'}}>➕ जोड़ें</Text></TouchableOpacity>
        <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
        {list.map((e:any,idx:number)=>(
          <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:8,borderRadius:6,marginTop:6}}>
            <Text style={{fontWeight:'bold',flex:1}}>{idx+1}. तिथि: {e.date} | समय: {e.samay} | एकड़: {e.ekad} | घंटा: {e.ghanta}</Text>
            <TouchableOpacity onPress={()=>removeFasalEntry(idx)}><Text style={{color:'red',fontWeight:'bold',marginLeft:6}}>हटाएं</Text></TouchableOpacity>
          </View>
        ))}
        </ScrollView>
      </View>
    );
  };

  const renderKisanSection=()=>{
    if(type!=='kisan') return null;
    const advList=getAdvanceList(form);
    return (
      <View style={{marginTop:12,backgroundColor:'#FFF8E1',padding:12,borderRadius:10,borderWidth:2,borderColor:'#FF9800'}}>
        <Text style={{fontSize:15,fontWeight:'900',color:'#E65100',textAlign:'center'}}>💰 एडवांस व टोटल राशि</Text>
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>एडवांस तिथि व राशि - टोटल एडवांस: ₹{getAdvanceTotal(form,type)}</Text>
        <View style={{flexDirection:'row',marginTop:6}}>
          <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={advDate} onChangeText={setAdvDate} placeholder="तारीख जैसे 07/09/2026" />
          <TextInput style={[s.inp,{flex:1,marginTop:0,marginLeft:6}]} value={advAmt} onChangeText={setAdvAmt} placeholder="राशि ₹" keyboardType="numeric" />
        </View>
        <TouchableOpacity style={{backgroundColor:'#FF9800',padding:10,borderRadius:8,marginTop:8,alignItems:'center'}} onPress={addAdvanceEntry}><Text style={{color:'#fff',fontWeight:'bold'}}>➕ एडवांस जोड़ें</Text></TouchableOpacity>
        <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
        {advList.map((e:any,idx:number)=>(
          <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:8,borderRadius:6,marginTop:6}}>
            <Text style={{fontWeight:'bold'}}>{idx+1}. {e.date} - ₹{e.amount}</Text>
            <TouchableOpacity onPress={()=>removeAdvanceEntry(idx)}><Text style={{color:'red',fontWeight:'bold'}}>हटाएं</Text></TouchableOpacity>
          </View>
        ))}
        </ScrollView>
        <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>बचत राशि</Text>
        <TextInput style={s.inp} value={form.bachatRashi} onChangeText={t=>updateFormField('bachatRashi',t)} keyboardType="numeric" placeholder="राशि लिखें" />
        <View style={[s.inp,{backgroundColor:'#FFE0B2',marginTop:10}]}><Text style={{fontWeight:'900',color:'#E65100',fontSize:17,textAlign:'center'}}>पूरा राशि जमा: ₹ {form.pooraRashi||'0'}</Text></View>
      </View>
    );
  };

  const renderBottomSection=()=>{
    if(!(type==='operator'||type==='helper')) return null;
    const dates=Array.isArray(form.upasthitiDates)?form.upasthitiDates:[];
    const advList=getAdvanceList(form);
    return (
      <View>
        <View style={{marginTop:16,backgroundColor:'#E8F5E9',padding:12,borderRadius:10,borderWidth:2,borderColor:'#2E7D32'}}>
          <Text style={{fontSize:15,fontWeight:'900',color:'#1B5E20',textAlign:'center'}}>📅 उपस्थिति व टोटल कार्यदिवस</Text>
          <View style={[s.inp,{backgroundColor:'#fff',marginTop:8}]}><Text style={{fontWeight:'900',color:'#1B5E20',fontSize:16,textAlign:'center'}}>{form.totalKaryadivas||'0'} दिन</Text></View>
          <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>उपस्थिति तिथियां - टोटल: {dates.length} दिन</Text>
          <View style={{flexDirection:'row',marginTop:6}}>
            <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={newDate} onChangeText={setNewDate} placeholder="तारीख जैसे 07/09/2026" />
            <TouchableOpacity style={{backgroundColor:'#2E7D32',paddingHorizontal:14,justifyContent:'center',borderRadius:8,marginLeft:6}} onPress={addUpasthitiDate}><Text style={{color:'#fff',fontWeight:'bold'}}>जोड़ें</Text></TouchableOpacity>
          </View>
          <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
          {dates.map((d:string,idx:number)=>(
            <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:8,borderRadius:6,marginTop:6}}>
              <Text style={{fontWeight:'bold'}}>{idx+1}. {d}</Text>
              <TouchableOpacity onPress={()=>removeUpasthitiDate(d)}><Text style={{color:'red',fontWeight:'bold'}}>हटाएं</Text></TouchableOpacity>
            </View>
          ))}
          </ScrollView>
        </View>
        <View style={{marginTop:12,backgroundColor:'#FFF8E1',padding:12,borderRadius:10,borderWidth:2,borderColor:'#FF9800'}}>
          <Text style={{fontSize:15,fontWeight:'900',color:'#E65100',textAlign:'center'}}>💰 एडवांस व टोटल राशि</Text>
          <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>एडवांस तिथि व राशि - टोटल एडवांस: ₹{getAdvanceTotal(form,type)}</Text>
          <View style={{flexDirection:'row',marginTop:6}}>
            <TextInput style={[s.inp,{flex:1,marginTop:0}]} value={advDate} onChangeText={setAdvDate} placeholder="तारीख जैसे 07/09/2026" />
            <TextInput style={[s.inp,{flex:1,marginTop:0,marginLeft:6}]} value={advAmt} onChangeText={setAdvAmt} placeholder="राशि ₹" keyboardType="numeric" />
          </View>
          <TouchableOpacity style={{backgroundColor:'#FF9800',padding:10,borderRadius:8,marginTop:8,alignItems:'center'}} onPress={addAdvanceEntry}><Text style={{color:'#fff',fontWeight:'bold'}}>➕ एडवांस जोड़ें</Text></TouchableOpacity>
          <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
          {advList.map((e:any,idx:number)=>(
            <View key={idx} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:8,borderRadius:6,marginTop:6}}>
              <Text style={{fontWeight:'bold'}}>{idx+1}. {e.date} - ₹{e.amount}</Text>
              <TouchableOpacity onPress={()=>removeAdvanceEntry(idx)}><Text style={{color:'red',fontWeight:'bold'}}>हटाएं</Text></TouchableOpacity>
            </View>
          ))}
          </ScrollView>
          <Text style={{fontSize:12,fontWeight:'bold',marginTop:10}}>बचत राशि</Text>
          <TextInput style={s.inp} value={form.bachatRashi} onChangeText={t=>updateFormField('bachatRashi',t)} keyboardType="numeric" placeholder="राशि लिखें" />
          <View style={[s.inp,{backgroundColor:'#FFE0B2',marginTop:10}]}><Text style={{fontWeight:'900',color:'#E65100',fontSize:17,textAlign:'center'}}>टोटल राशि: ₹ {form.totalRashi||'0'}</Text></View>
        </View>
      </View>
    );
  };

  const getFormKeys=()=>{
    return Object.keys(form).filter(k=>{
      if(k==='id') return false;
      if(BOTTOM_KEYS.includes(k)) return false;
      if(type==='kisan' && KISAN_BOTTOM.includes(k)) return false;
      if(type==='kisan' && KISAN_FASAL_KEYS.includes(k)) return false;
      return true;
    });
  };
  const getDetailKeys=()=>{
    return Object.keys(FULL[type]||{}).filter(k=>{
      if(k==='id') return false;
      if(BOTTOM_KEYS.includes(k)) return false;
      if(type==='kisan' && KISAN_BOTTOM.includes(k)) return false;
      if(type==='kisan' && KISAN_FASAL_KEYS.includes(k)) return false;
      return true;
    });
  };

  if(splash){ return(<View style={s.splash}><Image source={require('./assets/splash.png')} style={s.splashImage} resizeMode="cover" /><View style={s.loadBox}><Text style={s.loadText}>लोड हो रहा है... {progress}%</Text><View style={s.barBg}><View style={[s.barFill,{width:progress+'%'}]} /></View><Text style={s.loadSub}>{progress} / 100</Text></View></View>); }
  if(!isLogin){ return(<SafeAreaView style={s.loginSafe}><ScrollView contentContainerStyle={s.loginScroll} showsVerticalScrollIndicator={false}><View style={s.welcomeHeader}><Text style={s.welcomeTitle}>महानदी हार्वेस्टर मालिक कल्याण संघ{'\n'}जिला कांकेर (छत्तीसगढ़) में आपका स्वागत है</Text><Text style={s.welcomeSub}>हार्वेस्टर मालिकों का विश्वसनीय सहकारी मंच,{'\n'}शासकीय मान्यता प्राप्त सहकारी संस्था</Text></View><View style={s.loginBox}><Image source={require('./assets/login_logo.png')} style={s.loginLogo} resizeMode="contain" /><Text style={s.sloganText}>एकता हमारी-शक्ति हमारी-विकास हमारा</Text><TextInput style={s.loginInput} value={pass} onChangeText={setPass} placeholder="पासवर्ड" secureTextEntry={true} keyboardType="number-pad" /><TouchableOpacity style={s.loginBtn} onPress={doLogin}><Text style={s.loginBtnT}>लॉगिन करें</Text></TouchableOpacity></View><View style={s.addressBox}><Text style={s.addressTitle}>जिला कार्यालय</Text><Text style={s.addressText}>पता- लखनपुरी, मेन रोड़, N.H.30,{'\n'}जिला सहकारी बैंक के सामने,{'\n'}ब्लॉक-चारामा, जिला-कांकेर (छत्तीसगढ़)</Text><Text style={s.phoneText}>फोन नम्बर- 9479025929</Text><Text style={s.emailText} numberOfLines={1} ellipsizeMode="tail">ईमेल- mahanadiharvestar2026@gmail.com</Text></View></ScrollView></SafeAreaView>); }
  return(
    <SafeAreaView style={s.safe}>
      <View style={s.headColorful}><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}><Text style={{fontSize:32}}>🌾</Text><View style={{flex:1,alignItems:'center',paddingHorizontal:6}}><Text style={s.headTitle1}>महानदी हार्वेस्टर मालिक कल्याण संघ</Text><Text style={s.headTitle2}>जिला कांकेर (छत्तीसगढ़)</Text><View style={s.regBox}><Text style={s.headTitle3}>पंजीयन क्रमांक 122202678489</Text></View></View><Text style={{fontSize:32}}>🚜</Text></View></View>
      {view==='home' && <ScrollView><View style={{padding:12}}>{MENU.map(i=><TouchableOpacity key={i.key} style={[s.btn,{backgroundColor:i.color}]} onPress={()=>{ if(i.key==='logout') setView('logout'); else { setType(i.key); setView(i.key); }}}><Text style={s.btnTxt}>{i.title}</Text></TouchableOpacity>)}</View></ScrollView>}
      {view!=='home' && view!=='logout' && <View style={{flex:1}}><View style={s.sub}><TouchableOpacity onPress={()=>setView('home')}><Text>← वापस</Text></TouchableOpacity><Text>{MENU.find(m=>m.key===type)?.title}{search?` - मिले: ${getList().length} (कुल ${getTotal()})`:` (कुल: ${getTotal()})`}</Text><Text></Text></View><View style={s.search}><Text>🔍</Text><TextInput style={{flex:1,padding:8}} value={search} onChangeText={setSearch} placeholder='नाम, पता, मोबाइल या मोनो नंबर से सर्च करें' /></View><FlatList style={{flex:1}} data={getList()} keyExtractor={(it:any)=>it.id} renderItem={renderCard} initialNumToRender={20} maxToRenderPerBatch={20} windowSize={10} removeClippedSubviews={true} keyboardShouldPersistTaps="handled" /><TouchableOpacity style={s.fab} onPress={()=>openForm(type,null)}><Text style={s.fabT}>+</Text></TouchableOpacity></View>}
      {view==='logout' && <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',alignItems:'center',padding:15,paddingBottom:80}}><View style={[s.card,{width:'95%',alignItems:'center',padding:20,paddingBottom:30}]}><TouchableOpacity style={{backgroundColor:'#212121',width:'100%',marginTop:10,paddingVertical:22,borderRadius:12,alignItems:'center',elevation:5}} onPress={doLogout}><Text style={{color:'#fff',fontWeight:'900',fontSize:20}}>हाँ, लॉग आउट करें</Text></TouchableOpacity><TouchableOpacity style={{backgroundColor:'#2E7D32',width:'100%',marginTop:20,paddingVertical:22,borderRadius:12,alignItems:'center',elevation:5}} onPress={()=>setView('home')}><Text style={{color:'#fff',fontWeight:'900',fontSize:20}}>नहीं, वापस जाएं</Text></TouchableOpacity></View></ScrollView>}
      <Modal visible={show} animationType="slide"><View style={s.modal}><ScrollView style={{padding:12}} contentContainerStyle={{paddingBottom:120}}><Text style={{fontWeight:'bold',textAlign:'center',fontSize:16}}>{MENU.find(m=>m.key===type)?.title} फॉर्म</Text>
      {getFormKeys().map(k=>(
        <View key={k} style={{marginTop:8}}><Text style={{fontSize:12,fontWeight:'bold'}}>{HINDI[type]?.[k]||k}</Text><TextInput style={s.inp} value={form[k]} onChangeText={t=>setForm({...form,[k]:t})} /></View>
      ))}
      {renderKisanFasalSection()}
      {renderKisanSection()}
      {renderBottomSection()}
      </ScrollView><View style={s.modalBottom}><TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={()=>setShow(false)}><Text style={s.mBtnT}>वापस</Text></TouchableOpacity><TouchableOpacity style={[s.mBtn,{backgroundColor:'green'}]} onPress={save}><Text style={s.mBtnT}>सुरक्षित करें</Text></TouchableOpacity></View></View></Modal>

      <Modal visible={!!detailItem} animationType="slide" onRequestClose={()=>setDetailItem(null)}>
        <SafeAreaView style={s.modal}><ScrollView style={{padding:14}} contentContainerStyle={{paddingBottom:120}}>
            <Text style={{fontWeight:'900',textAlign:'center',fontSize:18,color:'#B71C1C',marginBottom:4}}>{MENU.find(m=>m.key===type)?.title} - पूरी जानकारी</Text>
            <Text style={{textAlign:'center',fontSize:12,color:'#888',marginBottom:12}}>बायोडाटा डिटेल</Text>
            {detailItem && getDetailKeys().map(k=>(
              <View key={k} style={s.detailRow}><Text style={s.detailLabel}>{HINDI[type]?.[k]||k}</Text><Text style={s.detailValue}>{detailItem[k]||'-'}</Text></View>
            ))}
            {type==='kisan' && detailItem? (
              <View style={{backgroundColor:'#E8F5E9',borderRadius:10,padding:12,marginBottom:10,borderWidth:2,borderColor:'#2E7D32'}}>
                <Text style={{fontWeight:'900',fontSize:15,color:'#1B5E20',textAlign:'center'}}>🌾 फसल कटाई - तिथि / समय / एकड़ / घंटा : {getFasalList(detailItem).length} प्रविष्टि</Text>
                <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                {getFasalList(detailItem).map((e:any,i:number)=>(<Text key={i} style={{fontSize:14,marginTop:4}}>{i+1}. तिथि: {e.date} | समय: {e.samay} | एकड़: {e.ekad} | घंटा: {e.ghanta}</Text>))}
                </ScrollView>
                <Text style={{fontWeight:'900',fontSize:14,color:'#1B5E20',marginTop:6}}>टोटल घंटा: {getFasalGhantaTotal(detailItem)}</Text>
              </View>
            ):null}
            {(type==='operator'||type==='helper') && detailItem? (
              <View style={{backgroundColor:'#E8F5E9',borderRadius:10,padding:12,marginBottom:10,borderWidth:2,borderColor:'#2E7D32'}}>
                <Text style={{fontWeight:'900',fontSize:15,color:'#1B5E20',textAlign:'center'}}>📅 उपस्थिति व टोटल कार्यदिवस: {getUpasthitiDates(detailItem).length} दिन</Text>
                <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                {getUpasthitiDates(detailItem).map((d:string,i:number)=>(<Text key={i} style={{fontSize:14,marginTop:4}}>{i+1}. {d}</Text>))}
                </ScrollView>
              </View>
            ):null}
            {(type==='operator'||type==='helper') && detailItem? (
              <View style={{backgroundColor:'#FFF8E1',borderRadius:10,padding:12,marginBottom:10,borderWidth:2,borderColor:'#FF9800'}}>
                <Text style={{fontWeight:'900',fontSize:15,color:'#E65100',textAlign:'center'}}>💰 एडवांस व टोटल राशि</Text>
                <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                {getAdvanceList(detailItem).map((e:any,i:number)=>(<Text key={i} style={{fontSize:14,marginTop:4}}>{i+1}. {e.date} - ₹{e.amount}</Text>))}
                </ScrollView>
                <Text style={{fontSize:14,marginTop:6}}>एडवांस टोटल: ₹{getAdvanceTotal(detailItem,type)}</Text>
                <Text style={{fontSize:14,marginTop:2}}>बचत राशि: ₹{detailItem.bachatRashi||'0'}</Text>
                <Text style={{fontWeight:'900',fontSize:16,color:'#E65100',marginTop:6}}>टोटल राशि: ₹{calcTotalRashi(detailItem,type)}</Text>
              </View>
            ):null}
            {type==='kisan' && detailItem? (
              <View style={{backgroundColor:'#FFF8E1',borderRadius:10,padding:12,marginBottom:10,borderWidth:2,borderColor:'#FF9800'}}>
                <Text style={{fontWeight:'900',fontSize:15,color:'#E65100',textAlign:'center'}}>💰 एडवांस व टोटल राशि</Text>
                <ScrollView style={{maxHeight:180,marginTop:6}} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                {getAdvanceList(detailItem).map((e:any,i:number)=>(<Text key={i} style={{fontSize:14,marginTop:4}}>{i+1}. {e.date} - ₹{e.amount}</Text>))}
                </ScrollView>
                <Text style={{fontSize:14,marginTop:6}}>एडवांस टोटल: ₹{getAdvanceTotal(detailItem,type)}</Text>
                <Text style={{fontSize:14,marginTop:2}}>बचत राशि: ₹{detailItem.bachatRashi||'0'}</Text>
                <Text style={{fontWeight:'900',fontSize:16,color:'#E65100',marginTop:6}}>पूरा राशि जमा: ₹{calcKisanTotal(detailItem)}</Text>
              </View>
            ):null}
            {detailItem?.mobile? (<View style={{flexDirection:'row',marginTop:14,flexWrap:'wrap',justifyContent:'center'}}><TouchableOpacity style={[s.sm,{backgroundColor:'#4CAF50'}]} onPress={()=>Linking.openURL(`tel:${detailItem.mobile}`)}><Text style={s.smT}>📞 कॉल</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#128C7E'}]} onPress={()=>Linking.openURL(`https://wa.me/91${detailItem.mobile.toString().replace(/\D/g,'').slice(-10)}`)}><Text style={s.smT}>🟢 व्हाट्सएप</Text></TouchableOpacity><TouchableOpacity style={[s.sm,{backgroundColor:'#2196F3'}]} onPress={()=>Linking.openURL(`sms:${detailItem.mobile}`)}><Text style={s.smT}>✉️ मैसेज</Text></TouchableOpacity></View>):null}
          </ScrollView><View style={s.modalBottom}><TouchableOpacity style={[s.mBtn,{backgroundColor:'#FF9800'}]} onPress={()=>{ const it=detailItem; setDetailItem(null); if(it) openForm(type,it); }}><Text style={s.mBtnT}>✏️ एडिट करें</Text></TouchableOpacity><TouchableOpacity style={[s.mBtn,{backgroundColor:'#888'}]} onPress={()=>setDetailItem(null)}><Text style={s.mBtnT}>वापस जाएं</Text></TouchableOpacity></View></SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:'#EEF2F7',paddingTop:30},
  headColorful:{backgroundColor:'#FFF8E1',margin:10,padding:14,borderRadius:16,borderWidth:2,borderColor:'#FFB300',elevation:4},
  headTitle1:{fontWeight:'900',fontSize:17,color:'#B71C1C',textAlign:'center'},
  headTitle2:{fontWeight:'800',fontSize:14,color:'#0D47A1',marginTop:5,textAlign:'center',backgroundColor:'#E3F2FD',paddingHorizontal:10,paddingVertical:2,borderRadius:10},
  regBox:{backgroundColor:'#1B5E20',paddingHorizontal:12,paddingVertical:3,borderRadius:20,marginTop:6},
  headTitle3:{fontWeight:'900',fontSize:11,color:'#FFEB3B',textAlign:'center'},
  btn:{padding:16,borderRadius:12,marginBottom:10,alignItems:'center'},
  btnTxt:{color:'#fff',fontWeight:'bold'},
  sub:{flexDirection:'row',justifyContent:'space-between',padding:12,backgroundColor:'#fff'},
  search:{flexDirection:'row',backgroundColor:'#fff',margin:8,paddingHorizontal:10,borderRadius:8,alignItems:'center',borderWidth:1,borderColor:'#FF9800'},
  card:{backgroundColor:'#fff',margin:8,padding:12,borderRadius:8},
  sm:{paddingHorizontal:14,paddingVertical:8,borderRadius:8,marginRight:8,marginBottom:6},
  smT:{color:'#fff',fontSize:13,fontWeight:'bold'},
  fab:{position:'absolute',right:16,bottom:16,width:56,height:56,borderRadius:28,backgroundColor:'#2E7D32',justifyContent:'center',alignItems:'center'},
  fabT:{color:'#fff',fontSize:28},
  inp:{backgroundColor:'#fff',borderWidth:1,borderColor:'#ccc',borderRadius:6,padding:8,marginTop:4},
  mBtn:{flex:1,padding:12,borderRadius:8
