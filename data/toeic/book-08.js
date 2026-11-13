/* TOEIC-style Book 08 — original practice items written for Ohh-Exam (not from any real TOEIC test). */
(function () {
  const mc = (d, q, o, ex) => ({ type: 'mc', d, q, o, a: 0, ex });

  // Part 6 texts
  const T1 = "NOTICE TO PASSENGERS\n\nEffective July 1, SkyLink Airways will update its checked baggage policy for all domestic flights. Each passenger will be allowed one checked bag weighing up to 23 kilograms at no [1] charge. A fee of $35 will apply to any additional bags. [2], bags that exceed the weight limit will be subject to an overweight fee of $50. [3]\n\nPassengers are encouraged to weigh their luggage at home before [4] for the airport. For more information, please visit www.skylinkair.com/baggage.";
  const T2 = "To: Tenants of Maple Court Office Building\nFrom: Gordon Pryce, Building Manager\nDate: October 2\nSubject: Parking lot repaving\n\nDear Tenants,\n\nThe parking lot behind our building will be repaved from October 9 to October 13. During this period, the lot will be [5] closed. Tenants may park at the Elm Street Garage, [6] is located two blocks east. The building management will cover the cost of parking there. Simply show your tenant ID card when you exit. [7]\n\nWe apologize for any [8] this work may cause and appreciate your patience.\n\nGordon Pryce";

  // Part 7 passages
  const P1 = "[Notice]\nHarbor Line Rail — Weekend Service Changes\n\nDue to track maintenance, the following changes will be in effect on Saturday, May 18, and Sunday, May 19:\n\n- Trains between Central Station and Bayview will run every 30 minutes instead of every 15 minutes.\n- Lakeside Station will be closed. Passengers should use Hillcrest Station, where free shuttle buses to Lakeside will operate every 20 minutes.\n- The last train from Central Station will depart at 10:30 P.M. rather than midnight.\n\nRegular service will resume on Monday, May 20. Tickets purchased for travel on May 18 or 19 can be used on any day until May 26. For updates, download the Harbor Line app or call 555-0163.";
  const P2 = "[E-mail]\nFrom: Customer Care <care@northwindair.com>\nTo: Priya Raman\nDate: March 3\nSubject: Change to your flight NW 482\n\nDear Ms. Raman,\n\nWe regret to inform you that your flight NW 482 from Chicago to Toronto on March 10 has been rescheduled. The new departure time is 2:45 P.M., three hours later than originally planned, due to a change in our aircraft schedule.\n\nIf the new time is not convenient, you may switch to another flight on the same day at no extra cost, or request a full refund. To make changes, please log in to your account at northwindair.com or reply to this e-mail within 48 hours.\n\nAs a gesture of apology, we have added 2,000 bonus points to your Northwind Rewards account.\n\nSincerely,\nNorthwind Air Customer Care";
  const P3 = "[Article]\nConstruction Begins on Westfield Airport's Terminal C\n\nWESTFIELD — Construction officially began last week on Terminal C at Westfield International Airport. The $480 million project, which will add 14 new gates, is designed to accommodate the airport's growing number of international travelers. Passenger traffic at Westfield increased by 22 percent last year, and the current terminals are often crowded during peak hours.\n\nThe new terminal will feature solar panels on its roof and an automated baggage system. Airport director Martin Okoye said the project is expected to create about 1,200 construction jobs. Terminal C is scheduled to open in two phases: the first eight gates in late 2028 and the remaining gates the following year.";

  window.TOEIC_UNITS = window.TOEIC_UNITS || [];
  window.TOEIC_UNITS.push({
    id: 'toeic-b08', n: 8, title: 'Book 08', th: 'ชุดที่ 08', en: 'Book 08', color: '#FF4B4B', dark: '#E03A3A', text: '#fff',
    lessons: [
      { id: 'toeic-b08-p5', title: 'Part 5 · Incomplete Sentences', questions: [
        // Word form
        mc(2, "Passengers are reminded to keep their boarding passes _____ until they reach the gate.",
          ['accessible', 'access', 'accessibly', 'accessibility'],
          "keep + กรรม + คุณศัพท์ (ให้อยู่ในสภาพ...) จึงใช้ accessible (หยิบได้ง่าย)"),
        mc(1, "The new subway line will provide a _____ route between the airport and the city center.",
          ['direct', 'directly', 'direction', 'directs'],
          "ระหว่าง a กับคำนาม route ต้องใช้คุณศัพท์ direct (ตรง)"),
        mc(1, "The construction crew worked _____ to finish the bridge repairs before the holiday weekend.",
          ['efficiently', 'efficient', 'efficiency', 'more efficient'],
          "ขยายกริยา worked ต้องใช้กริยาวิเศษณ์ efficiently"),
        mc(1, "Due to heavy snowfall, all _____ to Northfield have been canceled for the rest of the day.",
          ['departures', 'depart', 'departed', 'departing'],
          "หลัง all ต้องเป็นคำนามพหูพจน์ที่เป็นประธาน departures (เที่ยวบิน/เที่ยวรถที่ออก)"),
        mc(2, "The architect's design was praised for its _____ use of natural light throughout the terminal.",
          ['innovative', 'innovation', 'innovatively', 'innovate'],
          "ระหว่าง its กับคำนาม use ต้องใช้คุณศัพท์ innovative (สร้างสรรค์ใหม่)"),
        mc(3, "Contractors must obtain all required permits _____ to beginning any excavation work.",
          ['prior', 'priority', 'prioritize', 'priorly'],
          "สำนวน prior to + V-ing = ก่อนที่จะ..."),
        // Verb tense / voice / agreement
        mc(1, "Next month, the airline _____ a new direct service to Lisbon.",
          ['will launch', 'launched', 'has launched', 'was launching'],
          "Next month เป็นอนาคต จึงใช้ will launch"),
        mc(2, "The old warehouse on Pine Street _____ next spring to make room for a parking garage.",
          ['will be demolished', 'will demolish', 'demolished', 'is demolishing'],
          "โกดัง 'ถูก' รื้อถอน (passive) ในอนาคต จึงใช้ will be demolished"),
        mc(2, "The number of passengers using the regional rail network _____ steadily over the past five years.",
          ['has risen', 'have risen', 'rise', 'is rising'],
          "over the past five years ใช้ present perfect และประธาน The number (เอกพจน์) จึงใช้ has risen"),
        mc(3, "If the shipment had arrived on time, the crew _____ the roof installation by now.",
          ['would have completed', 'will complete', 'completes', 'had completed'],
          "If clause type 3 (had arrived) ส่วนผลใช้ would have + V3: would have completed"),
        // Prepositions / conjunctions
        mc(1, "Please arrive at the airport at least two hours _____ your scheduled departure time.",
          ['before', 'until', 'since', 'during'],
          "มาถึงสนามบิน 'ก่อน' เวลาออกเดินทางอย่างน้อยสองชั่วโมง ใช้ before"),
        mc(2, "Work on the new terminal is progressing _____ schedule despite the recent storms.",
          ['ahead of', 'instead of', 'in front', 'apart from'],
          "ahead of schedule = เร็วกว่ากำหนด"),
        mc(2, "The road will remain closed _____ the repairs are finished.",
          ['until', 'by', 'during', 'despite'],
          "ตามด้วยประโยค และความหมาย 'ปิดจนกว่าจะซ่อมเสร็จ' ใช้คำเชื่อม until"),
        mc(3, "_____ the bridge is reopened, drivers are advised to use Route 9 as an alternative.",
          ['Until', 'Since', 'Whether', 'Once'],
          "ให้ใช้เส้นทางอื่น 'จนกว่า' สะพานจะเปิดอีกครั้ง; Once/Since ทำให้ความหมายขัดกัน"),
        // Pronouns / relative clauses / comparatives
        mc(2, "The engineer _____ designed the new parking structure will give a presentation on Friday.",
          ['who', 'whose', 'whom', 'which'],
          "แทนคน (engineer) และทำหน้าที่ประธานของ designed ใช้ who"),
        mc(3, "Of all the proposals submitted, Hanley Builders offered the _____ timeline for completing the project.",
          ['shortest', 'shorter', 'short', 'more shortly'],
          "Of all + the + ขั้นสูงสุด จึงใช้ shortest"),
        // Business vocabulary
        mc(1, "Passengers can _____ their luggage at the counter near Gate 12.",
          ['check', 'board', 'land', 'depart'],
          "check luggage = โหลด/เช็กอินกระเป๋า"),
        mc(2, "The airline offers a full _____ to passengers whose flights are canceled.",
          ['refund', 'charge', 'fare', 'fee'],
          "a full refund = คืนเงินเต็มจำนวน เหมาะกับผู้โดยสารที่เที่ยวบินถูกยกเลิก"),
        mc(3, "The project manager asked the crew to _____ to all safety regulations while on site.",
          ['adhere', 'observe', 'follow', 'obey'],
          "adhere to = ปฏิบัติตาม; observe/follow/obey เป็นกริยาที่ตามด้วยกรรมทันที ไม่ใช้ to"),
        mc(2, "Because of a _____ in the supply of steel, the completion date has been pushed back two weeks.",
          ['shortage', 'surplus', 'margin', 'quota'],
          "การขาดแคลน (shortage) เหล็กทำให้วันแล้วเสร็จเลื่อนออกไป; surplus คือมีเกิน ไม่ทำให้ล่าช้า")
      ] },
      { id: 'toeic-b08-p67', title: 'Part 6–7 · Text Completion & Reading', questions: [
        // Part 6 — Text 1
        mc(1, T1 + "\n\nWhich option best fits blank [1]?",
          ['additional', 'addition', 'additionally', 'add'],
          "หน้าคำนาม charge ต้องใช้คุณศัพท์ additional (เพิ่มเติม)"),
        mc(2, "A fee of $35 will apply to any additional bags. [2], bags that exceed the weight limit will be subject to an overweight fee of $50.\n\nWhich option best fits blank [2]?",
          ['Furthermore', 'Otherwise', 'Nevertheless', 'Instead'],
          "เพิ่มข้อมูลค่าธรรมเนียมอีกประเภท จึงใช้ Furthermore (นอกจากนี้)"),
        mc(3, "...bags that exceed the weight limit will be subject to an overweight fee of $50. [3]\n\nWhich sentence best fits blank [3]?",
          ['Members of our frequent flyer program may be exempt from these fees.', 'The flight to Denver has been delayed by one hour.', 'Our new uniforms were designed by a local artist.', 'Meals are served on all international flights.'],
          "ประกาศเรื่องค่าธรรมเนียมกระเป๋า ประโยคเรื่องสมาชิกที่อาจได้รับยกเว้นค่าธรรมเนียมจึงต่อเนื่องกัน"),
        mc(2, "Passengers are encouraged to weigh their luggage at home before [4] for the airport.\n\nWhich option best fits blank [4]?",
          ['leaving', 'leave', 'left', 'to leave'],
          "before ใช้เป็นบุพบทตามด้วย V-ing: before leaving"),
        // Part 6 — Text 2
        mc(1, T2 + "\n\nWhich option best fits blank [5]?",
          ['completely', 'complete', 'completion', 'completed'],
          "ขยายคุณศัพท์/กริยา closed ต้องใช้กริยาวิเศษณ์ completely"),
        mc(2, "Tenants may park at the Elm Street Garage, [6] is located two blocks east.\n\nWhich option best fits blank [6]?",
          ['which', 'where', 'who', 'what'],
          "ต้องการประธานของ is located แทนสิ่งของ (garage) หลังจุลภาค ใช้ which"),
        mc(2, "The building management will cover the cost of parking there. Simply show your tenant ID card when you exit. [7]\n\nWhich sentence best fits blank [7]?",
          ['Normal parking access will resume on October 14.', 'The building was first constructed in 1985.', 'Rent payments are due on the first of each month.', 'The elevator in the lobby has been repaired.'],
          "อีเมลเรื่องปิดลานจอดรถ 9–13 ต.ค. ประโยคที่บอกว่าจะกลับมาใช้ได้ 14 ต.ค. จึงเข้ากับบริบท"),
        mc(2, "We apologize for any [8] this work may cause and appreciate your patience.\n\nWhich option best fits blank [8]?",
          ['inconvenience', 'inconvenient', 'inconveniently', 'inconvenienced'],
          "หลัง any ต้องเป็นคำนาม inconvenience (ความไม่สะดวก)"),
        // Part 7 — Passage 1
        mc(1, P1 + "\n\nWhat is the purpose of the notice?",
          ['To inform passengers of temporary service changes', 'To announce a fare increase', 'To advertise a new rail line', 'To recruit maintenance workers'],
          "ประกาศแจ้งการเปลี่ยนแปลงบริการชั่วคราวช่วงสุดสัปดาห์เพราะซ่อมราง"),
        mc(1, P1 + "\n\nHow can passengers get to Lakeside on May 18?",
          ['By taking a shuttle bus from Hillcrest Station', 'By taking a train from Central Station every 15 minutes', 'By using the Harbor Line app', 'By walking from Bayview Station'],
          "สถานี Lakeside ปิด ให้ไปสถานี Hillcrest แล้วนั่งรถรับส่งฟรีไป Lakeside"),
        mc(2, P1 + "\n\nWhat is NOT mentioned as a change?",
          ['Higher ticket prices', 'Less frequent trains', 'A station closure', 'An earlier last train'],
          "ประกาศพูดถึงรถไฟถี่น้อยลง ปิดสถานี และขบวนสุดท้ายเร็วขึ้น แต่ไม่ได้พูดถึงการขึ้นราคาตั๋ว"),
        mc(3, P1 + "\n\nWhat is suggested about a ticket bought for travel on May 18?",
          ['It will be accepted on May 22', 'It will be fully refunded', 'It can only be used on Saturday', 'It must be exchanged at Central Station'],
          "ตั๋ววันที่ 18–19 พ.ค. ใช้ได้ทุกวันจนถึง 26 พ.ค. ดังนั้นใช้วันที่ 22 ได้"),
        // Part 7 — Passage 2
        mc(1, P2 + "\n\nWhy was the e-mail sent?",
          ['To notify a passenger of a schedule change', 'To confirm a hotel reservation', 'To advertise a new route to Toronto', 'To request payment for a ticket'],
          "อีเมลแจ้งว่าเที่ยวบิน NW 482 ถูกเลื่อนเวลา"),
        mc(2, P2 + "\n\nWhat was the original departure time of flight NW 482?",
          ['11:45 A.M.', '2:45 P.M.', '5:45 P.M.', '10:45 A.M.'],
          "เวลาใหม่ 2:45 P.M. ช้ากว่าเดิม 3 ชั่วโมง เวลาเดิมจึงเป็น 11:45 A.M."),
        mc(2, P2 + "\n\nWhat has Northwind Air given Ms. Raman?",
          ['Bonus reward points', 'A free upgrade', 'A meal voucher', 'A discount on her next flight'],
          "สายการบินเพิ่มคะแนนโบนัส 2,000 คะแนนในบัญชีสะสมแต้มของเธอ"),
        mc(3, P2 + "\n\nThe word \"gesture\" in paragraph 3 is closest in meaning to",
          ['sign', 'movement', 'request', 'payment'],
          "a gesture of apology = สิ่งที่แสดงถึงการขอโทษ ใกล้เคียง sign; movement คือท่าทางทางกายภาพ ไม่เข้าบริบท"),
        // Part 7 — Passage 3
        mc(1, P3 + "\n\nWhat is the article mainly about?",
          ['The start of an airport expansion project', 'The closing of an old terminal', 'A decline in international travel', 'The hiring of a new airport director'],
          "บทความเรื่องการเริ่มก่อสร้างอาคาร Terminal C เพื่อขยายสนามบิน"),
        mc(2, P3 + "\n\nWhy is Terminal C being built?",
          ['To handle an increase in passengers', 'To replace a damaged terminal', 'To serve domestic flights only', 'To reduce airport staff'],
          "ผู้โดยสารเพิ่มขึ้น 22% และอาคารเดิมแออัด จึงสร้างเพื่อรองรับผู้โดยสารที่เพิ่มขึ้น"),
        mc(3, P3 + "\n\nWhat is true about Terminal C?",
          ['Some of its gates will open before others', 'It will have 22 new gates', 'It will be fully completed in 2028', 'It will be powered entirely by solar energy'],
          "เปิดสองระยะ: 8 ประตูแรกปลายปี 2028 ที่เหลือปีถัดไป; 22 คือเปอร์เซ็นต์ผู้โดยสาร ไม่ใช่จำนวนประตู"),
        mc(3, P3 + "\n\nHow many gates are scheduled to open in 2029?",
          ['Six', 'Eight', 'Fourteen', 'Twenty-two'],
          "ทั้งหมด 14 ประตู เปิด 8 ประตูในปี 2028 ที่เหลือ 6 ประตูเปิดปีถัดไป (2029)")
      ] }
    ]
  });
})();
