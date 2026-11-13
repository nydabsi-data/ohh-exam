/* TOEIC-style Book 07 — original practice items written for Ohh-Exam (not from any real TOEIC test). */
(function () {
  const mc = (d, q, o, ex) => ({ type: 'mc', d, q, o, a: 0, ex });

  // Part 6 texts
  const T1 = "To: All Business Account Holders\nFrom: Harlow Savings Bank\nSubject: Changes to Monthly Service Fees\n\nDear Valued Customer,\n\nBeginning on March 1, the monthly service fee for business checking accounts will [1] from $12 to $15. However, customers who maintain a minimum daily balance of $5,000 will continue to have the fee waived. [2], businesses that enroll in paperless statements will receive a $3 monthly discount.\n\nWe understand that changes like this can affect your budget. [3] Please visit any branch or call 555-0142 to schedule an [4].\n\nSincerely,\nCustomer Relations Team";
  const T2 = "MEMO\nTo: All Staff\nFrom: Rebecca Lind, Office Manager\nRe: Expense Reports\n\nStarting next month, all expense reports must be submitted through our new online system. Paper forms will no longer be [5]. Each report should include a scanned copy of every receipt, along with a brief description of the business purpose. Reports [6] after the fifth of the month will be processed in the following pay cycle. [7]\n\nTraining sessions on the system will be held on April 3 and April 5 in Conference Room B. Attendance is [8] for all employees who travel for work.\n\nThank you for your cooperation.";

  // Part 7 passages
  const P1 = "[Advertisement]\nBrightline Bookkeeping Services\n\nIs tax season keeping you up at night? Let Brightline handle the numbers so you can focus on running your business. For over fifteen years, our certified accountants have helped small businesses throughout the Riverside area manage payroll, prepare tax returns, and keep accurate financial records.\n\nOur monthly packages start at just $199 and include:\n- Monthly bank reconciliation\n- Quarterly tax filing\n- Year-end financial statements\n\nNew clients who sign up before June 30 will receive their first month free. To arrange a free consultation, visit www.brightline-books.com or call 555-0187. Please note that we do not currently offer services to businesses with more than 50 employees.";
  const P2 = "[E-mail]\nTo: Daniel Moreau <dmoreau@ferrisgroup.com>\nFrom: Aiko Tanaka <atanaka@tanakalegal.com>\nDate: September 14\nSubject: Lease renewal\n\nDear Mr. Moreau,\n\nI have reviewed the renewal agreement that your landlord sent last week. Most of the terms are the same as in your current lease, but there are two changes you should be aware of. First, the monthly rent will rise by 4 percent. Second, the new agreement requires a 90-day notice period for termination, rather than the current 60 days.\n\nI recommend that we ask the landlord to keep the 60-day notice period, as this gives your company more flexibility. Before I contact them, however, I need your approval. Please let me know by Friday so that we can respond before the September 30 deadline.\n\nBest regards,\nAiko Tanaka";
  const P3 = "[Article]\nWestbrook Bank and Coastal Trust to Merge\n\nWestbrook Bank announced on Monday that it has reached an agreement to acquire Coastal Trust, a smaller regional lender with 28 branches along the eastern coast. The deal, valued at $1.2 billion, is expected to be completed by the end of next year, pending approval from regulators.\n\nWestbrook's CEO, Laura Chen, said the merger would allow the bank to expand into markets where it currently has little presence. She also stated that no Coastal Trust branches would be closed during the first two years. Customers of Coastal Trust will not need to take any action at this time; their accounts will be transferred automatically once the merger is finalized.";

  window.TOEIC_UNITS = window.TOEIC_UNITS || [];
  window.TOEIC_UNITS.push({
    id: 'toeic-b07', n: 7, title: 'Book 07', th: 'ชุดที่ 07', en: 'Book 07', color: '#FF4B4B', dark: '#E03A3A', text: '#fff',
    lessons: [
      { id: 'toeic-b07-p5', title: 'Part 5 · Incomplete Sentences', questions: [
        // Word form
        mc(1, "All loan applications must be submitted with a _____ copy of the applicant's most recent tax return.",
          ['complete', 'completely', 'completion', 'completes'],
          "หน้าคำนาม copy ต้องใช้คุณศัพท์ complete (ครบถ้วน) ขยาย"),
        mc(1, "Ms. Patel reviewed the audit report _____ before presenting it to the board.",
          ['carefully', 'careful', 'care', 'carefulness'],
          "ขยายกริยา reviewed ต้องใช้กริยาวิเศษณ์ carefully"),
        mc(2, "The legal team expressed concern about the _____ of the contract's termination clause.",
          ['vagueness', 'vague', 'vaguely', 'vaguer'],
          "หลัง the และก่อน of ต้องเป็นคำนาม vagueness (ความคลุมเครือ)"),
        mc(1, "Clients who wish to close their accounts must provide written _____ at least thirty days in advance.",
          ['notification', 'notify', 'notified', 'notifying'],
          "written เป็นคุณศัพท์ ต้องตามด้วยคำนาม notification (การแจ้งเป็นลายลักษณ์อักษร)"),
        mc(3, "The merger agreement will become legally _____ once both parties have signed it.",
          ['binding', 'bind', 'bound', 'binds'],
          "legally binding = มีผลผูกพันทางกฎหมาย (สัญญาผูกมัดคู่สัญญา) ส่วน bound ใช้กับคนที่ถูกผูกมัด"),
        mc(2, "Despite a _____ decline in interest rates, the number of mortgage applications remained flat.",
          ['modest', 'modestly', 'modesty', 'modestness'],
          "ระหว่าง a กับคำนาม decline ต้องใช้คุณศัพท์ modest (เล็กน้อย)"),
        // Verb tense / voice / agreement
        mc(1, "The quarterly financial statements _____ to all shareholders next Friday.",
          ['will be sent', 'sent', 'are sending', 'have sent'],
          "งบการเงินถูกส่ง (passive) และ next Friday เป็นอนาคต จึงใช้ will be sent"),
        mc(2, "By the time the auditors arrived, the finance department _____ all the necessary receipts.",
          ['had gathered', 'gathers', 'will gather', 'has been gathered'],
          "เหตุการณ์ที่เสร็จก่อนอีกเหตุการณ์ในอดีต (arrived) ใช้ past perfect: had gathered"),
        mc(3, "Neither the lawyer nor her assistants _____ aware of the change to the filing deadline.",
          ['were', 'was', 'is', 'being'],
          "neither…nor กริยาผันตามประธานตัวที่ใกล้ที่สุด คือ assistants (พหูพจน์) จึงใช้ were"),
        mc(2, "Since joining the firm in 2019, Mr. Okafor _____ more than two hundred commercial lease agreements.",
          ['has drafted', 'drafts', 'is drafting', 'will draft'],
          "Since + จุดเวลาในอดีตจนถึงปัจจุบัน ใช้ present perfect: has drafted"),
        // Prepositions / conjunctions
        mc(1, "Interest is calculated daily and paid _____ the end of each month.",
          ['at', 'on', 'to', 'among'],
          "สำนวน at the end of = ตอนสิ้น(เดือน)"),
        mc(2, "_____ the client signs the revised agreement, the funds cannot be released.",
          ['Until', 'Because', 'Although', 'Whereas'],
          "Until = จนกว่า: ยังโอนเงินไม่ได้จนกว่าลูกค้าจะเซ็น ความหมายสมเหตุสมผลที่สุด"),
        mc(3, "The firm will cover all legal fees _____ the case is settled out of court.",
          ['provided that', 'in spite of', 'regardless', 'so as to'],
          "ตามด้วยประโยคเต็ม ต้องใช้คำเชื่อม provided that (โดยมีเงื่อนไขว่า) ส่วน in spite of/so as to ตามด้วยประโยคไม่ได้"),
        mc(3, "_____ its strong quarterly earnings, the bank decided to postpone the opening of new branches.",
          ['Despite', 'Although', 'Even though', 'However'],
          "ตามด้วยนามวลี (its strong earnings) ต้องใช้บุพบท Despite; Although/Even though ต้องตามด้วยประโยค"),
        // Pronouns / relative clauses / comparatives
        mc(2, "Applicants _____ credit history is incomplete may be asked to provide additional documents.",
          ['whose', 'who', 'whom', 'which'],
          "แสดงความเป็นเจ้าของ (ประวัติเครดิตของผู้สมัคร) ใช้ whose + คำนาม"),
        mc(2, "This year's audit was completed far _____ than last year's, thanks to the new accounting software.",
          ['more quickly', 'quickest', 'most quickly', 'quick'],
          "มี than และขยายกริยา completed จึงใช้ขั้นกว่าของกริยาวิเศษณ์ more quickly"),
        // Business vocabulary
        mc(1, "Customers can _____ money from any of our ATMs free of charge.",
          ['withdraw', 'borrow', 'lend', 'owe'],
          "withdraw money from an ATM = ถอนเงินจากตู้ ATM"),
        mc(2, "Both parties agreed to _____ the terms of the lease for another two years.",
          ['extend', 'expand', 'enlarge', 'widen'],
          "extend the terms/lease = ต่ออายุสัญญาออกไป ส่วนคำอื่นหมายถึงขยายขนาด"),
        mc(3, "The accounting department will _____ any expense claims that are submitted without original receipts.",
          ['reject', 'object', 'refrain', 'deprive'],
          "reject + กรรม = ปฏิเสธ(ไม่รับ) คำขอเบิก; object/refrain ต้องมี to/from และ deprive ไม่เข้าความหมาย"),
        mc(2, "Under the terms of the agreement, the borrower is _____ for paying all property taxes.",
          ['responsible', 'capable', 'reliant', 'dependent'],
          "be responsible for = รับผิดชอบต่อ; capable ใช้ of, reliant/dependent ใช้ on")
      ] },
      { id: 'toeic-b07-p67', title: 'Part 6–7 · Text Completion & Reading', questions: [
        // Part 6 — Text 1
        mc(1, T1 + "\n\nWhich option best fits blank [1]?",
          ['increase', 'increasing', 'increased', 'increasingly'],
          "หลัง will ต้องใช้กริยาช่อง 1 increase (ค่าธรรมเนียมจะเพิ่มขึ้น)"),
        mc(2, "...customers who maintain a minimum daily balance of $5,000 will continue to have the fee waived. [2], businesses that enroll in paperless statements will receive a $3 monthly discount.\n\nWhich option best fits blank [2]?",
          ['In addition', 'Instead', 'Otherwise', 'As a result'],
          "เป็นการเพิ่มสิทธิประโยชน์อีกข้อ จึงใช้ In addition (นอกจากนี้)"),
        mc(3, "We understand that changes like this can affect your budget. [3] Please visit any branch or call 555-0142 to schedule an [4].\n\nWhich sentence best fits blank [3]?",
          ['Our branch staff would be glad to review your account options with you.', 'The new branch will open in the downtown area next spring.', 'Your loan application has been approved.', 'Paper statements are no longer available for personal accounts.'],
          "ประโยคต่อไปชวนให้ไปสาขาหรือโทรนัด จึงเหมาะกับประโยคที่บอกว่าพนักงานยินดีช่วยทบทวนตัวเลือกบัญชี"),
        mc(2, "Please visit any branch or call 555-0142 to schedule an [4].\n\nWhich option best fits blank [4]?",
          ['appointment', 'assignment', 'agreement', 'enrollment'],
          "schedule an appointment = นัดหมาย เข้าความหมายกับการไปพบพนักงานที่สาขา"),
        // Part 6 — Text 2
        mc(1, T2 + "\n\nWhich option best fits blank [5]?",
          ['accepted', 'accept', 'accepting', 'acceptance'],
          "แบบฟอร์มกระดาษ 'ถูก' รับ จึงเป็น passive: be + accepted"),
        mc(2, "Reports [6] after the fifth of the month will be processed in the following pay cycle.\n\nWhich option best fits blank [6]?",
          ['received', 'receive', 'receiving', 'will receive'],
          "รายงานที่ 'ถูกรับ' หลังวันที่ 5 ใช้ past participle received ขยายคำนาม Reports"),
        mc(3, "Reports received after the fifth of the month will be processed in the following pay cycle. [7]\n\nWhich sentence best fits blank [7]?",
          ['This change will help the accounting team reimburse employees more quickly.', 'Please submit your vacation requests to your supervisor.', 'The office will be closed for the national holiday.', 'Our new clients include several regional banks.'],
          "บันทึกเรื่องระบบเบิกค่าใช้จ่ายใหม่ ประโยคที่บอกประโยชน์ของการเปลี่ยนแปลงนี้จึงเข้ากับบริบท"),
        mc(2, "Training sessions on the system will be held on April 3 and April 5 in Conference Room B. Attendance is [8] for all employees who travel for work.\n\nWhich option best fits blank [8]?",
          ['mandatory', 'eligible', 'responsible', 'dependent'],
          "Attendance is mandatory = การเข้าร่วมเป็นข้อบังคับ คำอื่นใช้กับ attendance ไม่ได้"),
        // Part 7 — Passage 1
        mc(1, P1 + "\n\nWhat is being advertised?",
          ['A financial record-keeping service', 'An accounting training course', 'A bank loan for small businesses', 'Tax preparation software'],
          "โฆษณาบริการทำบัญชี (bookkeeping) ให้ธุรกิจขนาดเล็ก"),
        mc(1, P1 + "\n\nWhat will new clients receive if they sign up before June 30?",
          ['One month of service at no cost', 'A discount on tax filing', 'A free software license', 'A personal financial advisor'],
          "ข้อความระบุว่า will receive their first month free = ได้ใช้บริการเดือนแรกฟรี"),
        mc(2, P1 + "\n\nWhat is NOT included in the monthly packages?",
          ['Investment advice', 'Bank reconciliation', 'Quarterly tax filing', 'Year-end financial statements'],
          "แพ็กเกจมีกระทบยอดธนาคาร ยื่นภาษีรายไตรมาส และงบการเงินสิ้นปี ไม่มีคำแนะนำการลงทุน"),
        mc(3, P1 + "\n\nWhich business would most likely NOT be able to use Brightline's services?",
          ['A company with 80 employees', 'A bakery with 12 employees', 'A business located in Riverside', 'A firm that needs help with payroll'],
          "โฆษณาระบุว่าไม่รับธุรกิจที่มีพนักงานเกิน 50 คน บริษัท 80 คนจึงใช้บริการไม่ได้"),
        // Part 7 — Passage 2
        mc(1, P2 + "\n\nWhy did Ms. Tanaka write the e-mail?",
          ['To explain changes in a lease agreement', 'To request payment for legal services', 'To announce a new office location', 'To introduce herself as a new landlord'],
          "อีเมลอธิบายข้อเปลี่ยนแปลงในสัญญาเช่าฉบับต่ออายุ (ค่าเช่าและระยะแจ้งยกเลิก)"),
        mc(3, P2 + "\n\nAccording to the e-mail, how would the termination notice period change under the new agreement?",
          ['It would become 30 days longer', 'It would be removed', 'It would become 4 percent shorter', 'It would stay the same'],
          "จากเดิม 60 วันเป็น 90 วัน คือยาวขึ้น 30 วัน (4% คือค่าเช่า ไม่ใช่ระยะแจ้ง)"),
        mc(2, P2 + "\n\nWho most likely is Ms. Tanaka?",
          ["A lawyer representing Mr. Moreau", "Mr. Moreau's landlord", "A real estate agent selling property", "An accountant at Ferris Group"],
          "อีเมลมาจาก tanakalegal.com และเธอตรวจสัญญาและจะติดต่อเจ้าของที่แทนเขา จึงน่าจะเป็นทนายของ Mr. Moreau"),
        mc(2, P2 + "\n\nWhat does Ms. Tanaka ask Mr. Moreau to do?",
          ['Approve her proposed request by Friday', 'Sign the agreement by September 30', 'Pay the increased rent in advance', 'Meet with the landlord in person'],
          "เธอต้องการการอนุมัติจากเขาก่อนติดต่อเจ้าของที่ และขอให้ตอบภายในวันศุกร์"),
        // Part 7 — Passage 3
        mc(1, P3 + "\n\nWhat is the article mainly about?",
          ['A planned acquisition between two banks', 'The opening of new bank branches', 'A change in bank leadership', 'New government rules for lenders'],
          "บทความเรื่อง Westbrook Bank จะเข้าซื้อกิจการ Coastal Trust"),
        mc(2, P3 + "\n\nThe word \"pending\" in paragraph 1 is closest in meaning to",
          ['awaiting', 'avoiding', 'rejecting', 'ignoring'],
          "pending approval = ระหว่างรอการอนุมัติ ใกล้เคียงกับ awaiting"),
        mc(2, P3 + "\n\nWhat is true about Coastal Trust?",
          ['Its customers do not need to do anything now', 'It will close several branches next year', 'It is acquiring Westbrook Bank', 'Its CEO is Laura Chen'],
          "บทความระบุว่าลูกค้า Coastal Trust ไม่ต้องดำเนินการใด ๆ ในตอนนี้ บัญชีจะโอนอัตโนมัติ"),
        mc(3, P3 + "\n\nWhy does Westbrook Bank most likely want to merge with Coastal Trust?",
          ['To grow in regions where it is not well established', 'To reduce the number of its employees', 'To close unprofitable branches', 'To avoid government regulations'],
          "CEO บอกว่าการควบรวมช่วยขยายเข้าตลาดที่ธนาคารยังมีสาขาน้อย")
      ] }
    ]
  });
})();
