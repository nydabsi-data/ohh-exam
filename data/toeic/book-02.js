/* TOEIC-style Book 02 — original practice items written for Ohh-Exam (not from any real TOEIC test). */
(function () {
  const mc = (d, q, o, ex) => ({ type: 'mc', d, q, o, a: 0, ex });

  // ---- Part 6 texts ----
  const T1 = "Questions [1]-[4] refer to the following e-mail.\n\nTo: Valued Customers\nFrom: Greenleaf Home Store\nSubject: Store Renovation\n\nDear Customer,\nWe are pleased to announce that our Riverside store will be renovated next month. During the work, the store will remain open, [1] some departments may be temporarily moved. The renovation will give us more space to display our [2] range of furniture. In addition, we are adding a cafe on the second floor. To thank you for your patience, we are offering 15% off all purchases [3] March 1 to March 14. Simply show this e-mail at the checkout to [4] the discount.\n\nSincerely,\nThe Greenleaf Team";
  const T2 = "Questions [5]-[8] refer to the following notice.\n\nFree Financial Planning Seminar\n\nWestbridge Community Bank invites local business owners to a free seminar on managing cash flow. The event will be held on Saturday, October 4, at the Westbridge Public Library. Our [5] advisors will explain how to prepare a budget, reduce costs, and plan for taxes. Space is limited, so registration is [6]. To reserve a seat, please call our customer service center or visit any branch. Light refreshments will be [7] after the presentation. Participants who complete a short feedback form will receive a free planner. We look forward to [8] you there.";

  // ---- Part 7 passages ----
  const PA = "Questions refer to the following advertisement.\n\nGrand Opening Sale - Marlow Electronics\n\nCelebrate the opening of our newest store at Eastgate Shopping Center! From Friday, June 6 to Sunday, June 15, enjoy up to 40% off televisions, laptops, and headphones. The first 100 customers on opening day will receive a free wireless speaker. Members of our Marlow Rewards program earn double points on every purchase during the sale. Not a member yet? Sign up at the store in less than five minutes - membership is free. Please note that discounts cannot be combined with other coupons, and sale prices do not apply to online orders.\n\nOpen daily 10 A.M. - 9 P.M. Free parking is available in the center's underground garage.";
  const PB = "Questions refer to the following e-mail.\n\nFrom: Laura Kim, Accounts Payable, Norden Supplies\nTo: Peter Walsh, Walsh Catering\nSubject: Invoice #4471\nDate: September 9\n\nDear Mr. Walsh,\nThank you for sending invoice #4471 for the catering services you provided at our staff event on August 28. Before we can process payment, we need a correction. The invoice lists 120 meals, but our records show that only 95 guests attended, as agreed in our final order. Could you please send a revised invoice? Once we receive it, payment will be made within 14 days by bank transfer. I apologize for any inconvenience, and thank you again for the excellent food.\n\nBest regards,\nLaura Kim";
  const PC = "Questions refer to the following schedule.\n\nAsia Retail Innovation Forum - Day 1 Program (Hall C)\n\n9:00 - 9:30   Registration and coffee\n9:30 - 10:30   Opening keynote: The Future of Cashless Payments (Dr. Anan Chaiyasit)\n10:45 - 12:00   Panel: Reducing Waste in Supply Chains\n12:00 - 1:00   Lunch (Garden Terrace)\n1:00 - 2:15   Workshop: Building Customer Loyalty Online *\n2:30 - 3:30   Case study: How a Family Bakery Doubled Its Sales\n3:30 - 4:00   Closing remarks\n\n* Workshop seats are limited to 40. Sign up at the registration desk.\nNote: Due to a scheduling conflict, the case study session has been moved from Hall B to Hall C.";

  window.TOEIC_UNITS = window.TOEIC_UNITS || [];
  window.TOEIC_UNITS.push({
    id: 'toeic-b02', n: 2, title: 'Book 02', th: 'ชุดที่ 02', en: 'Book 02', color: '#FF4B4B', dark: '#E03A3A', text: '#fff',
    lessons: [
      { id: 'toeic-b02-p5', title: 'Part 5 · Incomplete Sentences', questions: [
        mc(1, "The store will be closed _____ December 25 for the holiday.", ["on", "in", "at", "by"], "ใช้ on กับวันที่/วันเฉพาะ → on December 25"),
        mc(1, "Customers can return items _____ within 30 days of purchase.", ["easily", "easy", "ease", "easier"], "ขยายกริยา return ต้องใช้ adverb → easily"),
        mc(1, "The annual report shows a significant _____ in online sales.", ["increase", "increasingly", "increased", "increasing"], "หลัง a + adjective (significant) ต้องเป็นคำนาม → increase in = การเพิ่มขึ้นของ"),
        mc(2, "The event organizers were _____ about the number of people who registered for the conference.", ["enthusiastic", "enthusiasm", "enthusiastically", "enthusiast"], "หลัง be (were) + about ต้องใช้ adjective → enthusiastic about"),
        mc(2, "Ms. Patel's _____ for the position of finance manager was approved by the board.", ["nomination", "nominate", "nominates", "nominative"], "หลังรูปแสดงความเป็นเจ้าของ (Ms. Patel's) ต้องเป็นคำนาม → nomination"),
        mc(3, "The retailer's profits rose _____ after it launched its mobile app.", ["considerably", "considerable", "consideration", "considerate"], "ขยายกริยา rose ต้องใช้ adverb → considerably (อย่างมาก)"),
        mc(2, "Ticket holders should arrive early, as seating at the gala is _____ limited.", ["extremely", "extreme", "extremes", "extremity"], "ขยาย adjective limited ต้องใช้ adverb → extremely"),
        mc(1, "Last year, the company _____ three new stores in Bangkok.", ["opened", "opens", "has opened", "will open"], "Last year = อดีตที่จบแล้ว ใช้ past simple; present perfect ใช้กับ last year ไม่ได้"),
        mc(2, "The annual shareholders' meeting _____ until further notice.", ["has been postponed", "has postponed", "postponing", "postpone"], "การประชุม 'ถูกเลื่อน' ต้องเป็น passive → has been postponed"),
        mc(3, "Neither the manager nor the cashiers _____ aware of the price change.", ["were", "was", "is", "being"], "Neither A nor B กริยาผันตามประธานตัวที่ใกล้ (the cashiers = พหูพจน์) และเป็นอดีต → were"),
        mc(3, "If the venue had been booked earlier, the company _____ a larger hall.", ["could have reserved", "can reserve", "will reserve", "reserves"], "If conditional type 3 (had + V3) → could/would have + V3"),
        mc(2, "_____ its high prices, the boutique remains popular with young shoppers.", ["Despite", "Although", "Because", "Even"], "ตามด้วยนามวลี (its high prices) และความหมายขัดแย้ง → Despite; Although ต้องตามด้วยประโยค"),
        mc(2, "Payments received _____ the 15th of the month will appear on next month's statement.", ["after", "along", "among", "beside"], "after the 15th = หลังวันที่ 15 จึงไปอยู่ในใบแจ้งยอดเดือนหน้า"),
        mc(3, "The festival will take place outdoors _____ it rains, in which case it will move to the city hall.", ["unless", "until", "whereas", "so"], "unless = เว้นแต่ (ถ้าฝนตกจะย้ายไปที่ศาลากลาง)"),
        mc(1, "Customers who sign up for the loyalty program will receive _____ membership cards by mail.", ["their", "them", "they", "theirs"], "หน้าคำนาม membership cards ใช้ possessive adjective → their"),
        mc(2, "This quarter's sales were _____ than those of the same period last year.", ["higher", "highest", "high", "highly"], "มี than → ใช้ขั้นกว่า higher"),
        mc(2, "Please _____ your receipt as proof of purchase.", ["retain", "remain", "contain", "sustain"], "retain = เก็บรักษาไว้ (retain your receipt); remain เป็นอกรรมกริยา"),
        mc(1, "The bank charges a small _____ for international money transfers.", ["fee", "fare", "wage", "salary"], "fee = ค่าธรรมเนียมบริการ; fare = ค่าโดยสาร"),
        mc(2, "Tickets for the trade fair can be purchased in _____ at a discounted price.", ["advance", "front", "ahead", "before"], "สำนวน in advance = ล่วงหน้า"),
        mc(3, "Our accountant recommended that we _____ a portion of each month's profit for unexpected expenses.", ["set aside", "put off", "take over", "run out"], "set aside = กันเงินไว้ใช้ภายหลัง; put off = เลื่อน, run out = หมด")
      ] },
      { id: 'toeic-b02-p67', title: 'Part 6–7 · Text Completion & Reading', questions: [
        // Part 6 - Text 1
        mc(2, T1 + "\n\nChoose the best answer for blank [1].", ["but", "so", "or", "because"], "ร้านยังเปิด 'แต่' บางแผนกอาจย้ายชั่วคราว → but (ขัดแย้ง)"),
        mc(2, "...The renovation will give us more space to display our [2] range of furniture.\n\nChoose the best answer for blank [2].", ["extensive", "extensively", "extend", "extension"], "ขยายคำนาม range ต้องใช้ adjective → extensive range (สินค้าหลากหลาย)"),
        mc(1, "...we are offering 15% off all purchases [3] March 1 to March 14.\n\nChoose the best answer for blank [3].", ["from", "between", "since", "during"], "รูปคู่ from ... to ... (between ต้องคู่กับ and)"),
        mc(1, "...Simply show this e-mail at the checkout to [4] the discount.\n\nChoose the best answer for blank [4].", ["receive", "receiving", "received", "receipt"], "to แสดงจุดประสงค์ + V ฐาน → to receive"),
        // Part 6 - Text 2
        mc(2, T2 + "\n\nChoose the best answer for blank [5].", ["experienced", "experience", "experiencing", "experiences"], "ขยายคำนาม advisors ใช้ adjective experienced (มีประสบการณ์)"),
        mc(3, "...Space is limited, so registration is [6]. To reserve a seat, please call our customer service center or visit any branch.\n\nChoose the best answer for blank [6].", ["required", "requiring", "requirement", "requires"], "is + V3 (passive) → registration is required = ต้องลงทะเบียน; requirement เอกพจน์ต้องมี a"),
        mc(1, "...Light refreshments will be [7] after the presentation.\n\nChoose the best answer for blank [7].", ["served", "serving", "serve", "server"], "ของว่าง 'ถูกเสิร์ฟ' → will be served (passive)"),
        mc(3, "...We look forward to [8] you there.\n\nChoose the best answer for blank [8].", ["seeing", "see", "seen", "sees"], "look forward to (to เป็น preposition) + V-ing → seeing"),
        // Part 7 - Passage A
        mc(1, PA + "\n\nWhat is being advertised?", ["A sale at a new store", "An online shopping service", "A rewards card for a bank", "A shopping center's parking garage"], "หัวข้อ Grand Opening Sale = ลดราคาฉลองเปิดร้านใหม่"),
        mc(2, PA + "\n\nHow can a customer get a free wireless speaker?", ["By arriving early on opening day", "By joining the rewards program", "By spending over a set amount", "By ordering online"], "The first 100 customers on opening day จะได้ลำโพงฟรี → ต้องมาเร็ววันเปิด"),
        mc(2, PA + "\n\nWhat is NOT true about the sale?", ["Sale prices are available online", "It lasts for ten days", "Members earn extra points", "Discounts cannot be combined with coupons"], "ระบุ sale prices do not apply to online orders; June 6–15 = 10 วัน"),
        mc(3, PA + "\n\nThe word \"apply\" in the advertisement is closest in meaning to", ["be relevant", "request", "put on", "work hard"], "do not apply to online orders = ไม่มีผล/ไม่เกี่ยวข้องกับคำสั่งซื้อออนไลน์ ≈ be relevant"),
        // Part 7 - Passage B
        mc(1, PB + "\n\nWhy did Ms. Kim write the e-mail?", ["To request a corrected invoice", "To order catering for an event", "To complain about the food", "To confirm that a payment has been made"], "Could you please send a revised invoice? = ขอใบแจ้งหนี้ที่แก้ไข"),
        mc(2, PB + "\n\nWhat is the problem with invoice #4471?", ["The number of meals is wrong", "The event date is wrong", "It was sent late", "The bank details are missing"], "ใบแจ้งหนี้ระบุ 120 meals แต่ตกลงไว้ 95 คน"),
        mc(3, PB + "\n\nWhat is suggested about Mr. Walsh?", ["He has not yet been paid for the August event", "He attended the staff event as a guest", "He works in accounts payable", "He has already sent a revised invoice"], "Before we can process payment, we need a correction → ยังไม่ได้รับเงิน"),
        mc(2, PB + "\n\nWhen will payment be made?", ["Within 14 days after the revised invoice arrives", "On August 28", "On September 9", "Within 14 days after the event"], "Once we receive it, payment will be made within 14 days"),
        // Part 7 - Passage C
        mc(1, PC + "\n\nWhat is this schedule for?", ["The first day of a business forum", "A training course for bakers", "A company's annual party", "A product launch"], "หัวข้อ Asia Retail Innovation Forum - Day 1 Program"),
        mc(2, PC + "\n\nWhere will lunch be served?", ["On the Garden Terrace", "In Hall B", "In Hall C", "At the registration desk"], "12:00 - 1:00 Lunch (Garden Terrace)"),
        mc(2, PC + "\n\nWhat must attendees do to join the workshop?", ["Sign up at the registration desk", "Pay an extra fee", "Arrive before 9:00", "Contact Dr. Chaiyasit"], "หมายเหตุ * : Sign up at the registration desk (จำกัด 40 ที่)"),
        mc(3, PC + "\n\nWhat is indicated about the case study session?", ["It was originally planned for a different room", "It has been canceled", "It will be led by Dr. Chaiyasit", "It is limited to 40 participants"], "Note: moved from Hall B to Hall C → เดิมจัดอีกห้อง")
      ] }
    ]
  });
})();
