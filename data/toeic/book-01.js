/* TOEIC-style Book 01 — original practice items written for Ohh-Exam (not from any real TOEIC test). */
(function () {
  const mc = (d, q, o, ex) => ({ type: 'mc', d, q, o, a: 0, ex });

  // ---- Part 6 texts ----
  const T1 = "Questions [1]-[4] refer to the following e-mail.\n\nTo: All Staff\nFrom: Karen Wells, Office Manager\nSubject: Office Move\n\nDear colleagues,\nAs you know, our team will move to the fifth floor of the Harmon Building on May 12. Please pack your personal items [1] Friday, May 9. Boxes and labels are available at the front desk. The moving company will transport all furniture and computers over the weekend. [2], you do not need to disconnect your own equipment. If you have any questions, please contact me [3]. We appreciate your [4] during this transition.\n\nBest regards,\nKaren Wells";
  const T2 = "Questions [5]-[8] refer to the following memo.\n\nMEMO\nTo: All Department Heads\nRe: New Travel Booking System\n\nStarting June 1, all business trips must be booked through TravelDesk, our new online system. The system [5] staff to compare flight and hotel prices in one place. Requests will be sent automatically to your manager for [6]. Employees who book travel outside the system will not be reimbursed unless they receive written permission in advance. [7] training sessions will be held in the main conference room next week. Please encourage your team members to [8] one before the end of May.";

  // ---- Part 7 passages ----
  const PA = "Questions refer to the following advertisement.\n\nBrightline Logistics - Now Hiring: Office Administrator\n\nBrightline Logistics, a growing freight company based in Leeds, is looking for a full-time Office Administrator to join its head office. The successful candidate will manage the reception area, schedule meetings for senior staff, and order office supplies. Applicants should have at least two years of administrative experience and strong computer skills. Knowledge of a second language is an advantage but not required. We offer a competitive salary, 25 days of paid holiday, and free parking. To apply, submit your CV and a cover letter through the Careers page of our Web site by April 30. Only shortlisted candidates will be contacted.";
  const PB = "Questions refer to the following e-mail.\n\nFrom: Daniel Ortiz\nTo: Mei Sato\nSubject: Your trip to Toronto\nDate: March 3\n\nHi Mei,\nI have finalized the arrangements for your trip to the Toronto sales conference. Your flight leaves at 8:15 A.M. on March 18, and you will arrive at 11:40 A.M. local time. A driver from the hotel will meet you at the arrivals gate. You are booked at the Lakeview Hotel for three nights; breakfast is included, but dinner is not. The conference begins on the afternoon of March 18, so you should have enough time to check in first. Please note that the client dinner originally planned for March 19 has been moved to March 20. Let me know if you need anything else.\n\nDaniel";
  const PC = "Questions refer to the following article.\n\nHartwell Insurance Tries Four-Day Week\n\nHartwell Insurance announced last week that about 200 employees at its Manchester office will take part in a six-month trial of a four-day working week. Staff in the trial will work slightly longer hours from Monday to Thursday but will receive the same salary. The company's customer service line will stay open five days a week, so team schedules will rotate. 'We believe rested employees serve our customers better,' said HR Director Paula Mensah. If the trial improves productivity and reduces sick days, Hartwell plans to extend the program to its other three offices next year. Results will be shared with staff in a report this autumn.";

  window.TOEIC_UNITS = window.TOEIC_UNITS || [];
  window.TOEIC_UNITS.push({
    id: 'toeic-b01', n: 1, title: 'Book 01', th: 'ชุดที่ 01', en: 'Book 01', color: '#FF4B4B', dark: '#E03A3A', text: '#fff',
    lessons: [
      { id: 'toeic-b01-p5', title: 'Part 5 · Incomplete Sentences', questions: [
        mc(1, "Please submit your expense reports _____ Friday afternoon.", ["by", "until", "since", "during"], "by = ภายใน (กำหนดเส้นตาย) ใช้กับการส่งงานให้ทันเวลา; until ใช้กับการกระทำต่อเนื่อง"),
        mc(1, "The HR department will review all applications _____.", ["carefully", "careful", "care", "carefulness"], "ขยายกริยา review ต้องใช้ adverb → carefully"),
        mc(1, "Ms. Tanaka was praised for her _____ to the training program.", ["contribution", "contribute", "contributed", "contributor"], "หลัง her ต้องเป็นคำนาม และ contribution to = การมีส่วนร่วมต่อ (contributor เป็นคน ไม่เข้าความหมาย)"),
        mc(2, "Employees must wear identification badges that are clearly _____ at all times.", ["visible", "visibly", "visibility", "vision"], "หลัง be (are) + adverb clearly ต้องตามด้วย adjective → visible"),
        mc(2, "The orientation session was _____ informative for new staff.", ["highly", "high", "higher", "height"], "ขยาย adjective informative ต้องใช้ adverb → highly (= มาก)"),
        mc(2, "Because of its _____ location, the new branch office attracts many walk-in clients.", ["convenient", "conveniently", "convenience", "conveniences"], "ขยายคำนาม location ต้องใช้ adjective → convenient"),
        mc(3, "The committee will announce its decision after a _____ review of all candidates.", ["thorough", "thoroughly", "thoroughness", "through"], "ระหว่าง a กับคำนาม review ต้องเป็น adjective → thorough (ละเอียดถี่ถ้วน)"),
        mc(1, "Mr. Lee _____ for the company since 2018.", ["has worked", "works", "worked", "is working"], "มี since + จุดเวลา ใช้ present perfect → has worked"),
        mc(2, "The quarterly staff meeting _____ in Conference Room B next Tuesday.", ["will be held", "was held", "holds", "has held"], "next Tuesday = อนาคต และการประชุม 'ถูกจัด' จึงใช้ future passive → will be held"),
        mc(2, "Each of the new interns _____ a mentor from the marketing team.", ["is assigned", "are assigned", "assigning", "have assigned"], "Each of + พหูพจน์ ใช้กริยาเอกพจน์ และเป็น passive (ได้รับมอบหมาย) → is assigned"),
        mc(3, "By the time the director arrives in Singapore, the hotel staff _____ her room.", ["will have prepared", "prepared", "have prepared", "are preparing"], "By the time + present simple (เหตุการณ์อนาคต) ใช้ future perfect → will have prepared"),
        mc(2, "_____ the flight was delayed, the team still arrived in time for the client meeting.", ["Although", "Despite", "Because", "Unless"], "ตามด้วยประโยค และความหมายขัดแย้ง (ล่าช้า แต่ยังทัน) → Although; Despite ต้องตามด้วยคำนาม"),
        mc(2, "Travel reimbursement requests must be accompanied _____ original receipts.", ["by", "from", "at", "of"], "be accompanied by = ต้องแนบ/มาพร้อมกับ"),
        mc(3, "Staff may work from home on Fridays _____ they remain available by phone during office hours.", ["provided that", "so that", "even though", "in case of"], "provided that = โดยมีเงื่อนไขว่า เข้ากับความหมาย; in case of ต้องตามด้วยคำนาม"),
        mc(1, "Ms. Garcia asked the assistant to send the agenda to _____ before the meeting.", ["her", "she", "hers", "its"], "หลัง preposition to ต้องใช้สรรพนามกรรม → her"),
        mc(3, "Applicants _____ résumés are incomplete will not be considered for an interview.", ["whose", "who", "whom", "which"], "แสดงความเป็นเจ้าของ (résumés ของผู้สมัคร) ใช้ whose + คำนาม"),
        mc(1, "All employees are required to _____ the safety training by the end of the month.", ["complete", "consist", "occur", "reach"], "complete the training = ทำการอบรมให้เสร็จ; consist/occur เป็นอกรรมกริยา"),
        mc(2, "The airline offers a full refund if the flight is _____ due to bad weather.", ["canceled", "refused", "rejected", "denied"], "เที่ยวบิน 'ถูกยกเลิก' ใช้ canceled; คำอื่นไม่ใช้กับเที่ยวบิน"),
        mc(2, "Please keep your receipts so that the finance team can _____ your travel expenses.", ["reimburse", "earn", "borrow", "lend"], "reimburse expenses = คืนเงินค่าใช้จ่ายที่จ่ายไปก่อน"),
        mc(3, "The new hiring policy is intended to attract candidates with a wide _____ of experience.", ["range", "scale", "distance", "measure"], "collocation: a wide range of = หลากหลาย")
      ] },
      { id: 'toeic-b01-p67', title: 'Part 6–7 · Text Completion & Reading', questions: [
        // Part 6 - Text 1
        mc(1, T1 + "\n\nChoose the best answer for blank [1].", ["by", "until", "since", "within"], "pack ... by Friday = เก็บของให้เสร็จภายในวันศุกร์ (กำหนดเส้นตาย)"),
        mc(2, "...The moving company will transport all furniture and computers over the weekend. [2], you do not need to disconnect your own equipment.\n\nChoose the best answer for blank [2].", ["Therefore", "However", "Otherwise", "In contrast"], "บริษัทขนย้ายจัดการให้ 'ดังนั้น' ไม่ต้องถอดอุปกรณ์เอง → Therefore (แสดงผล)"),
        mc(2, "...If you have any questions, please contact me [3].\n\nChoose the best answer for blank [3].", ["directly", "directness", "direction", "directed"], "ขยายกริยา contact ต้องใช้ adverb → directly (ติดต่อโดยตรง)"),
        mc(1, "...We appreciate your [4] during this transition.\n\nChoose the best answer for blank [4].", ["cooperation", "cooperate", "cooperative", "cooperatively"], "หลัง your ต้องเป็นคำนาม → cooperation (ความร่วมมือ)"),
        // Part 6 - Text 2
        mc(3, T2 + "\n\nChoose the best answer for blank [5].", ["allows", "lets", "makes", "has"], "allow + คน + to V; ส่วน let/make/have ต้องตามด้วย V ไม่มี to"),
        mc(2, "...Requests will be sent automatically to your manager for [6].\n\nChoose the best answer for blank [6].", ["approval", "approve", "approved", "approving"], "หลัง for ในที่นี้ต้องเป็นคำนาม → approval (การอนุมัติ)"),
        mc(2, "...[7] training sessions will be held in the main conference room next week.\n\nChoose the best answer for blank [7].", ["Brief", "Briefly", "Briefness", "Briefed"], "ขยายคำนาม training sessions ต้องใช้ adjective → Brief (สั้นๆ)"),
        mc(1, "...Please encourage your team members to [8] one before the end of May.\n\nChoose the best answer for blank [8].", ["attend", "attending", "attended", "attends"], "encourage + คน + to + V ฐาน → to attend"),
        // Part 7 - Passage A
        mc(1, PA + "\n\nWhat is being advertised?", ["An office job", "A freight delivery service", "A language course", "A parking facility"], "หัวข้อ 'Now Hiring: Office Administrator' = ประกาศรับสมัครงานในสำนักงาน"),
        mc(2, PA + "\n\nWhat is a requirement for the position?", ["Two years of administrative experience", "A university degree", "Fluency in a second language", "A driving license"], "ระบุว่า should have at least two years of administrative experience; ภาษาที่สองไม่บังคับ"),
        mc(3, PA + "\n\nWhat is NOT mentioned as a benefit of the job?", ["Health insurance", "Paid holiday", "Free parking", "A competitive salary"], "สวัสดิการที่ระบุ: salary, 25 days paid holiday, free parking — ไม่มีประกันสุขภาพ"),
        mc(3, PA + "\n\nWhat will most likely happen to applicants who are not shortlisted?", ["They will not hear from the company", "They will be invited to an interview", "They will receive a rejection letter", "They will be asked to reapply in April"], "Only shortlisted candidates will be contacted → คนที่ไม่ผ่านจะไม่ได้รับการติดต่อ"),
        // Part 7 - Passage B
        mc(1, PB + "\n\nWhy did Mr. Ortiz write the e-mail?", ["To give details of a business trip", "To invite Ms. Sato to a client dinner", "To ask Ms. Sato to book a hotel", "To announce a new conference"], "ประโยคแรก: finalized the arrangements for your trip → แจ้งรายละเอียดการเดินทาง"),
        mc(2, PB + "\n\nHow will Ms. Sato get from the airport to the hotel?", ["A hotel driver will pick her up", "She will take a taxi", "Mr. Ortiz will drive her", "She will take the train"], "A driver from the hotel will meet you at the arrivals gate"),
        mc(2, PB + "\n\nThe word \"finalized\" in line 1 is closest in meaning to", ["completed", "questioned", "delayed", "changed"], "finalize = ทำให้เสร็จสมบูรณ์/ยืนยันขั้นสุดท้าย ≈ completed"),
        mc(3, PB + "\n\nWhat has changed since the original plan?", ["The date of the client dinner", "The flight departure time", "The name of the hotel", "The length of the hotel stay"], "the client dinner originally planned for March 19 has been moved to March 20"),
        // Part 7 - Passage C
        mc(1, PC + "\n\nWhat is the article mainly about?", ["A trial of a shorter working week", "A new customer service line", "The opening of a new office", "A change in salary policy"], "หัวข้อและประโยคแรก: six-month trial of a four-day working week"),
        mc(2, PC + "\n\nWhat will employees in the trial do?", ["Work longer hours on fewer days", "Receive a lower salary", "Work only from home", "Close the customer service line on Fridays"], "work slightly longer hours from Monday to Thursday but receive the same salary"),
        mc(3, PC + "\n\nHow many offices does Hartwell Insurance most likely have?", ["Four", "Three", "Two", "Five"], "มีสำนักงาน Manchester + its other three offices = รวม 4 แห่ง"),
        mc(2, PC + "\n\nWhat is stated about the trial?", ["It will last six months", "It includes all Hartwell employees", "It began last year", "It was suggested by customers"], "ระบุ a six-month trial; ผู้เข้าร่วมเพียงประมาณ 200 คนที่ Manchester")
      ] }
    ]
  });
})();
