/* English · Vocabulary (TOEIC words) — original meanings, definitions and examples written for Ohh-Exam.
   Each unit = 10 words → one lesson of 20 questions, built from the word list in a fixed order
   (no randomness here, so question keys "<lesson id>#<index>" stay the same). The app shuffles options.
   Word fields: [word, part of speech, Thai meaning, English definition, example sentence]. */
(function () {
  const DECKS = [
    { id: 'office', title: 'In the office', th: 'ในออฟฟิศ', color: '#CA6B48', dark: '#B85836', w: [
      ['agenda', 'n.', 'วาระการประชุม', 'a list of things to talk about at a meeting', 'The budget is the first item on the agenda.'],
      ['deadline', 'n.', 'กำหนดส่ง', 'the latest time by which something must be done', 'The deadline for the report is Friday.'],
      ['colleague', 'n.', 'เพื่อนร่วมงาน', 'a person you work with', 'I had lunch with a colleague from sales.'],
      ['supervisor', 'n.', 'หัวหน้างาน', 'a person who is in charge of a group of workers', 'Ask your supervisor before you leave early.'],
      ['extension', 'n.', 'เบอร์ต่อภายใน', 'one of several phone lines inside a building', 'Call me at extension 214.'],
      ['memo', 'n.', 'บันทึกภายใน', 'a short written message sent inside a company', 'HR sent a memo about the new holidays.'],
      ['supplies', 'n.', 'อุปกรณ์สำนักงาน', 'things such as paper and pens that an office uses', 'We are running low on office supplies.'],
      ['cabinet', 'n.', 'ตู้เก็บของ', 'a piece of furniture with shelves or drawers', 'The files are in the cabinet by the door.'],
      ['schedule', 'n.', 'ตารางเวลา', 'a plan of when things will happen', 'Please check the schedule for next week.'],
      ['copier', 'n.', 'เครื่องถ่ายเอกสาร', 'a machine that makes copies of documents', 'The copier on this floor is out of order.']] },
    { id: 'hr', title: 'Jobs & hiring', th: 'งานและการรับสมัคร', color: '#DFA590', dark: '#D17E60', w: [
      ['applicant', 'n.', 'ผู้สมัคร', 'a person who asks for a job in writing', 'We received forty applicants for the job.'],
      ['resume', 'n.', 'ประวัติย่อ', 'a document that lists your education and work experience', 'Please send your resume by e-mail.'],
      ['qualified', 'adj.', 'มีคุณสมบัติเหมาะสม', 'having the skills or training needed for a job', 'She is highly qualified for the position.'],
      ['hire', 'v.', 'จ้าง', 'to give someone a job', 'The company will hire ten new engineers.'],
      ['promote', 'v.', 'เลื่อนตำแหน่ง', 'to give someone a higher position at work', 'The manager plans to promote two team leaders.'],
      ['resign', 'v.', 'ลาออก', 'to leave your job by your own choice', 'He decided to resign and start his own business.'],
      ['salary', 'n.', 'เงินเดือน', 'the fixed amount of money paid for a job', 'The job offers a good salary.'],
      ['benefits', 'n.', 'สวัสดิการ', 'extra things an employer gives, such as health insurance', 'Benefits include a free gym membership.'],
      ['intern', 'n.', 'นักศึกษาฝึกงาน', 'a student who works for a short time to gain experience', 'Our intern helps with social media.'],
      ['retire', 'v.', 'เกษียณ', 'to stop working because of your age', 'Ms. Park will retire next year.']] },
    { id: 'money', title: 'Money & finance', th: 'การเงิน', color: '#B54A58', dark: '#9F414E', w: [
      ['invoice', 'n.', 'ใบแจ้งหนี้', 'a document that asks for payment for goods or services', 'Please pay the invoice within 30 days.'],
      ['budget', 'n.', 'งบประมาณ', 'the amount of money planned for a purpose', 'The project is over budget.'],
      ['expense', 'n.', 'ค่าใช้จ่าย', 'money spent on something', 'The company will pay every travel expense.'],
      ['revenue', 'n.', 'รายได้', 'money a company receives from sales', 'Revenue rose by 8% this year.'],
      ['profit', 'n.', 'กำไร', 'money left after costs are paid', 'The store made a small profit last month.'],
      ['reimburse', 'v.', 'คืนเงินที่สำรองจ่าย', 'to pay back money someone has spent for work', 'We will reimburse your taxi fare.'],
      ['receipt', 'n.', 'ใบเสร็จ', 'a paper that shows you have paid', 'Keep the receipt in case you return it.'],
      ['quarterly', 'adj.', 'รายไตรมาส', 'happening every three months', 'The quarterly report is due in April.'],
      ['estimate', 'n.', 'ราคาประเมิน', 'a guess of a cost or amount', 'The builder gave us an estimate of $5,000.'],
      ['refund', 'n.', 'เงินคืน', 'money given back to a customer', 'You can get a full refund within 14 days.']] },
    { id: 'travel', title: 'Travel', th: 'การเดินทาง', color: '#A24E2F', dark: '#884128', w: [
      ['itinerary', 'n.', 'กำหนดการเดินทาง', 'a plan of a trip with times and places', 'Your itinerary is attached to this e-mail.'],
      ['boarding pass', 'n.', 'บัตรขึ้นเครื่อง', 'a card that lets you get on a plane', 'Show your boarding pass at the gate.'],
      ['delay', 'n.', 'ความล่าช้า', 'a time when something happens later than planned', 'There was a one-hour delay because of fog.'],
      ['accommodation', 'n.', 'ที่พัก', 'a place to stay', 'Accommodation is included in the price.'],
      ['departure', 'n.', 'การออกเดินทาง', 'the act of leaving a place', 'Departure is at 7:15 from Gate 9.'],
      ['luggage', 'n.', 'กระเป๋าเดินทาง', 'the bags you take on a trip', 'You may bring one piece of luggage.'],
      ['reservation', 'n.', 'การจอง', 'an arrangement to keep a room, seat, or table for you', 'I made a reservation for two nights.'],
      ['complimentary', 'adj.', 'ฟรี ไม่คิดเงิน', 'given free of charge', 'Guests enjoy a complimentary breakfast.'],
      ['shuttle', 'n.', 'รถรับส่ง', 'a bus that goes back and forth between two places', 'A shuttle runs to the airport every hour.'],
      ['destination', 'n.', 'จุดหมายปลายทาง', 'the place you are traveling to', 'Bangkok is a popular destination.']] },
    { id: 'ship', title: 'Orders & shipping', th: 'สั่งซื้อและขนส่ง', color: '#CB7F89', dark: '#BA5663', w: [
      ['shipment', 'n.', 'สินค้าที่ส่ง', 'a load of goods sent together', 'The shipment will arrive on Monday.'],
      ['warehouse', 'n.', 'คลังสินค้า', 'a large building where goods are stored', 'Extra stock is kept in the warehouse.'],
      ['supplier', 'n.', 'ผู้จัดหาสินค้า', 'a company that provides goods to another company', 'We changed our paper supplier.'],
      ['inventory', 'n.', 'สินค้าคงคลัง', 'all the goods a business has in stock', 'We check the inventory every month.'],
      ['deliver', 'v.', 'ส่งของ', 'to take goods to a place', 'We deliver free to addresses in the city.'],
      ['package', 'n.', 'พัสดุ', 'something wrapped to be sent by mail', 'A package came for you this morning.'],
      ['discount', 'n.', 'ส่วนลด', 'a lower price than usual', 'Members get a 10% discount.'],
      ['warranty', 'n.', 'การรับประกัน', 'a promise to repair a product for a period of time', 'The laptop has a two-year warranty.'],
      ['bulk', 'n.', 'จำนวนมาก', 'a large amount bought at one time', 'Buying in bulk lowers the price.'],
      ['order', 'v.', 'สั่งซื้อ', 'to ask for goods to be sent to you', 'We need to order more paper.']] },
    { id: 'event', title: 'Meetings & events', th: 'ประชุมและงานอีเวนต์', color: '#B95361', dark: '#9C404C', w: [
      ['venue', 'n.', 'สถานที่จัดงาน', 'the place where an event happens', 'The venue holds 300 people.'],
      ['attendee', 'n.', 'ผู้เข้าร่วม', 'a person who goes to an event', 'Each attendee will receive a name badge.'],
      ['postpone', 'v.', 'เลื่อนออกไป', 'to move an event to a later time', 'They had to postpone the launch until June.'],
      ['register', 'v.', 'ลงทะเบียน', 'to put your name on a list for an event', 'Please register online before May 1.'],
      ['keynote', 'n.', 'การบรรยายหลัก', 'the most important speech at an event', 'The CEO will give the keynote.'],
      ['minutes', 'n.', 'บันทึกการประชุม', 'a written record of what was said at a meeting', 'Lisa will take the minutes today.'],
      ['handout', 'n.', 'เอกสารแจก', 'a paper given to people at a talk or class', 'Please read the handout before we start.'],
      ['reschedule', 'v.', 'เปลี่ยนเวลานัด', 'to change the time of a planned event', 'Can we reschedule our call to Thursday?'],
      ['conference', 'n.', 'การประชุมใหญ่', 'a large formal meeting over one or more days', 'The conference is in Singapore this year.'],
      ['catering', 'n.', 'บริการจัดอาหาร', 'providing food and drinks for an event', 'Catering is included in the room price.']] },
    { id: 'verbs', title: 'Business verbs', th: 'กริยาธุรกิจ', color: '#CB7F89', dark: '#BD5D6A', w: [
      ['launch', 'v.', 'เปิดตัว', 'to start selling a new product', 'They will launch the new phone in May.'],
      ['expand', 'v.', 'ขยาย', 'to make something bigger', 'The company plans to expand into Vietnam.'],
      ['negotiate', 'v.', 'เจรจาต่อรอง', 'to discuss in order to reach an agreement', 'We tried to negotiate a lower price.'],
      ['submit', 'v.', 'ยื่น ส่ง', 'to give a document for someone to consider', 'Submit your application by June 1.'],
      ['approve', 'v.', 'อนุมัติ', 'to officially agree to something', 'The manager will approve the budget today.'],
      ['implement', 'v.', 'นำไปปฏิบัติ', 'to start using a plan or system', 'We will implement the new policy next month.'],
      ['comply', 'v.', 'ปฏิบัติตาม', 'to follow a rule or law', 'All products must comply with safety rules.'],
      ['coordinate', 'v.', 'ประสานงาน', 'to organize people to work well together', 'She will coordinate the training program.'],
      ['merge', 'v.', 'ควบรวม', 'to join two companies into one', 'The two banks will merge next year.'],
      ['renovate', 'v.', 'ปรับปรุง ซ่อมแซม', 'to repair and improve a building', 'The hotel plans to renovate its lobby.']] },
    { id: 'adj', title: 'Useful adjectives', th: 'คุณศัพท์ที่ออกบ่อย', color: '#D17E60', dark: '#BF5C38', w: [
      ['mandatory', 'adj.', 'บังคับ', 'required by a rule', 'Safety training is mandatory for all staff.'],
      ['temporary', 'adj.', 'ชั่วคราว', 'lasting only for a short time', 'The office is in a temporary location.'],
      ['efficient', 'adj.', 'มีประสิทธิภาพ', 'working well without wasting time or energy', 'The new system is more efficient.'],
      ['reliable', 'adj.', 'ไว้ใจได้', 'able to be trusted to work well', 'We need a reliable delivery company.'],
      ['convenient', 'adj.', 'สะดวก', 'easy to use or reach', 'Is Monday convenient for you?'],
      ['eligible', 'adj.', 'มีสิทธิ์', 'allowed to do or receive something', 'Full-time staff are eligible for a bonus.'],
      ['available', 'adj.', 'ว่าง มีให้ใช้', 'free to be used or seen', 'Is Mr. Lee available this afternoon?'],
      ['outstanding', 'adj.', 'ค้างชำระ / ดีเด่น', 'not yet paid; or excellent', 'There is an outstanding balance of $200.'],
      ['confidential', 'adj.', 'เป็นความลับ', 'meant to be kept secret', 'Salary details are confidential.'],
      ['upcoming', 'adj.', 'ที่กำลังจะมาถึง', 'happening soon', 'Please read about the upcoming changes.']] }
  ];

  const mc = (d, q, o, ex) => ({ type: 'mc', d, q, o, a: 0, ex });
  const tf = (d, q, a, ex) => ({ type: 'tf', d, q, a, ex });
  const info = (w) => w[0] + ' (' + w[1] + ') = ' + w[2] + ' · ' + w[3] + ' · ตัวอย่าง: ' + w[4];
  // the example with the word taken out (the word may end in -s, -ed …)
  const blank = (w) => w[4].replace(new RegExp('\\b' + w[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\w*', 'i'), '_____');
  const other = (ws, i, steps) => steps.map((s) => ws[(i + s) % ws.length]);

  function lesson(D) {
    const ws = D.w, q = [];
    // 1) card matching: words 1–5, then 6–10
    q.push({ type: 'match', d: 1, q: 'จับคู่คำศัพท์กับความหมาย', pairs: ws.slice(0, 5).map((w) => [w[0], w[2]]), ex: ws.slice(0, 5).map((w) => w[0] + ' = ' + w[2]).join(' · ') });
    // 2) word → meaning (words 1–5)
    ws.slice(0, 5).forEach((w, i) => q.push(mc(1, '"' + w[0] + '" แปลว่าอะไร', [w[2]].concat(other(ws, i, [1, 4, 7]).map((x) => x[2])), info(w))));
    q.push({ type: 'match', d: 1, q: 'จับคู่คำศัพท์กับความหมาย', pairs: ws.slice(5, 10).map((w) => [w[0], w[2]]), ex: ws.slice(5, 10).map((w) => w[0] + ' = ' + w[2]).join(' · ') });
    // 3) meaning → word (words 6–10)
    ws.slice(5, 10).forEach((w, k) => { const i = k + 5; q.push(mc(2, 'คำไหนแปลว่า "' + w[2] + '"', [w[0]].concat(other(ws, i, [2, 5, 8]).map((x) => x[0])), info(w))); });
    // 4) English definition → word (every other word)
    [0, 8].forEach((i) => { const w = ws[i]; q.push(mc(2, 'Which word means: "' + w[3] + '"?', [w[0]].concat(other(ws, i, [3, 6, 9]).map((x) => x[0])), info(w))); });
    // 5) fill the gap in the example (the rest)
    [1, 3, 5, 7].forEach((i) => { const w = ws[i]; q.push(mc(3, 'เติมคำที่หายไป: ' + blank(w), [w[0]].concat(other(ws, i, [1, 3, 7]).map((x) => x[0])), info(w))); });
    // 6) true / false on a meaning: one true, one false (2 + 5 + 2 + 5 + 2 + 4 = 20)
    const t = ws[9], f = ws[3];
    q.push(tf(1, '"' + t[0] + '" แปลว่า "' + t[2] + '"', true, info(t)));
    q.push(tf(1, '"' + f[0] + '" แปลว่า "' + ws[8][2] + '"', false, '"' + f[0] + '" แปลว่า "' + f[2] + '" ส่วน "' + ws[8][2] + '" คือ ' + ws[8][0]));
    return q;
  }

  const themedWords = DECKS.flatMap((deck) => deck.w);
  const byPart = (part) => themedWords.filter((word) => word[1] === part).slice(0, 10);
  const PARTS_OF_SPEECH = [
    { id: 'pos-noun', title: 'Nouns (n.)', th: 'คำนาม (n.)', color: '#83C7D5', dark: '#226577', w: byPart('n.') },
    { id: 'pos-verb', title: 'Verbs (v.)', th: 'คำกริยา (v.)', color: '#729CAD', dark: '#355F70', w: byPart('v.') },
    { id: 'pos-adjective', title: 'Adjectives (adj.)', th: 'คำคุณศัพท์ (adj.)', color: '#DFA590', dark: '#A55035', w: byPart('adj.') },
    { id: 'pos-adverb', title: 'Adverbs (adv.)', th: 'คำกริยาวิเศษณ์ (adv.)', color: '#CB7F89', dark: '#9F414E', w: [
      ['usually', 'adv.', 'โดยปกติ', 'in most cases', 'The office usually opens at nine.'],
      ['carefully', 'adv.', 'อย่างระมัดระวัง', 'with attention to detail or safety', 'Read the contract carefully before signing.'],
      ['soon', 'adv.', 'เร็ว ๆ นี้', 'in a short time from now', 'We will announce the results soon.'],
      ['recently', 'adv.', 'เมื่อไม่นานมานี้', 'a short time ago', 'We recently moved to a larger office.'],
      ['nearly', 'adv.', 'เกือบ', 'almost but not quite', 'The report is nearly complete.'],
      ['directly', 'adv.', 'โดยตรง', 'without going through an intermediate person or place', 'Send the invoice directly to the accountant.'],
      ['automatically', 'adv.', 'โดยอัตโนมัติ', 'without someone having to do it manually', 'The system automatically saves your changes.'],
      ['immediately', 'adv.', 'ทันที', 'without delay', 'Please contact the front desk immediately.'],
      ['occasionally', 'adv.', 'เป็นครั้งคราว', 'sometimes but not often', 'We occasionally hold meetings online.'],
      ['together', 'adv.', 'ด้วยกัน', 'with one another', 'Both teams worked together on the project.']
    ] }
  ];

  const FLASH_WORDS_BY_PART = {
    'n.': `
accountant|นักบัญชี
address|ที่อยู่
advertisement|โฆษณา
agreement|ข้อตกลง
airport|สนามบิน
amount|จำนวน
announcement|ประกาศ
appointment|นัดหมาย
assignment|งานที่ได้รับมอบหมาย
audience|ผู้ชม
author|ผู้เขียน
bakery|ร้านเบเกอรี
bank|ธนาคาร
bill|ใบเรียกเก็บเงิน
branch|สาขา
brochure|แผ่นพับ
building|อาคาร
business|ธุรกิจ
candidate|ผู้สมัครรับตำแหน่ง
cashier|พนักงานเก็บเงิน
certificate|ใบรับรอง
chairperson|ประธานที่ประชุม
city|เมือง
client|ผู้ว่าจ้าง
cloud|เมฆ
committee|คณะกรรมการ
company|บริษัท
computer|คอมพิวเตอร์
condition|เงื่อนไข
contract|สัญญา
conversation|บทสนทนา
coupon|คูปอง
customer|ลูกค้า
decision|การตัดสินใจ
stationery|เครื่องเขียน
department|แผนก
director|ผู้อำนวยการ
document|เอกสาร
donation|เงินบริจาค
drawer|ลิ้นชัก
driver|คนขับรถ
envelope|ซองจดหมาย
equipment|อุปกรณ์
event|กิจกรรม
factory|โรงงาน
flight|เที่ยวบิน
form|แบบฟอร์ม
garage|โรงจอดรถ
guest|แขก
guide|ผู้พาชม
hotel|โรงแรม
interview|การสัมภาษณ์
journey|การเดินทาง
key|กุญแจ
library|ห้องสมุด
manager|ผู้จัดการ
market|ตลาด
meal|มื้ออาหาร
medicine|ยา
menu|รายการอาหาร
message|ข้อความ
museum|พิพิธภัณฑ์
neighbor|เพื่อนบ้าน
newspaper|หนังสือพิมพ์
office|สำนักงาน
owner|เจ้าของ
parcel|หีบห่อ
passport|หนังสือเดินทาง
payment|การชำระเงิน
photograph|ภาพถ่าย
project|โครงการ
recipe|สูตรอาหาร
report|รายงาน
suitcase|กระเป๋าเดินทาง
workshop|การอบรมเชิงปฏิบัติการ
`,
    'v.': `
accept|ยอมรับ
add|เพิ่ม
advise|แนะนำ
allow|อนุญาต
announce|ประกาศ
answer|ตอบ
apologize|ขอโทษ
appear|ปรากฏ
arrange|จัดเตรียม
arrive|มาถึง
ask|ถาม
attend|เข้าร่วม
avoid|หลีกเลี่ยง
begin|เริ่ม
borrow|ยืม
build|สร้าง
buy|ซื้อ
calculate|คำนวณ
cancel|ยกเลิก
carry|ถือไป
change|เปลี่ยน
check|ตรวจสอบ
choose|เลือก
clean|ทำความสะอาด
collect|รวบรวม
compare|เปรียบเทียบ
complete|ทำให้เสร็จ
confirm|ยืนยัน
connect|เชื่อมต่อ
consider|พิจารณา
contact|ติดต่อ
continue|ทำต่อ
cook|ทำอาหาร
copy|คัดลอก
correct|แก้ไข
count|นับ
decide|ตัดสินใจ
decrease|ลดลง
describe|บรรยาย
design|ออกแบบ
discuss|หารือ
divide|แบ่ง
download|ดาวน์โหลด
draw|วาด
drink|ดื่ม
drive|ขับรถ
eat|กิน
encourage|ให้กำลังใจ
enter|เข้าไป
evaluate|ประเมินผล
examine|ตรวจอย่างละเอียด
exercise|ออกกำลังกาย
explain|อธิบาย
find|หาเจอ
finish|เสร็จสิ้น
fix|ซ่อม
follow|ติดตาม
forget|ลืม
gather|รวมตัว
give|ให้
greet|ทักทาย
help|ช่วย
improve|ปรับให้ดีขึ้น
include|รวมไว้ด้วย
inform|แจ้งให้ทราบ
invite|เชิญ
join|เข้าร่วมเป็นส่วนหนึ่ง
learn|เรียนรู้
listen|ฟัง
measure|วัด
notice|สังเกตเห็น
offer|เสนอ
prepare|เตรียม
recommend|แนะนำให้เลือก
remind|เตือนความจำ
`,
    'adj.': `
accurate|แม่นยำ
active|กระตือรือร้น
affordable|ราคาเอื้อมถึง
afraid|กลัว
annual|ประจำปี
appropriate|เหมาะสม
attractive|น่าดึงดูด
awake|ตื่นอยู่
basic|ขั้นพื้นฐาน
beautiful|สวย
busy|ยุ่ง
bright|สว่าง
broken|เสีย
calm|สงบ
careful|ระมัดระวัง
cheap|ราคาถูก
clear|ชัดเจน
cold|เย็น
comfortable|สบาย
common|พบได้ทั่วไป
competitive|แข่งขันได้
creative|สร้างสรรค์
crowded|แออัด
curious|ใคร่รู้
dangerous|อันตราย
dark|มืด
deep|ลึก
delicious|อร่อย
different|แตกต่าง
difficult|ยาก
dry|แห้ง
early|แต่เนิ่น ๆ
easy|ง่าย
empty|ว่างเปล่า
equal|เท่ากัน
excellent|ยอดเยี่ยม
expensive|แพง
fair|ยุติธรรม
famous|มีชื่อเสียง
familiar|คุ้นเคย
fast|เร็ว
flexible|ยืดหยุ่น
formal|เป็นทางการ
fresh|สด
friendly|เป็นมิตร
full|เต็ม
gentle|อ่อนโยน
grateful|รู้สึกขอบคุณ
happy|มีความสุข
healthy|สุขภาพดี
heavy|หนัก
helpful|เป็นประโยชน์
honest|ซื่อสัตย์
hot|ร้อน
important|สำคัญ
independent|เป็นอิสระ
international|ระหว่างประเทศ
kind|ใจดี
large|ขนาดใหญ่
late|สาย
legal|ถูกกฎหมาย
light|น้ำหนักเบา
local|ท้องถิ่น
long|ยาว
loud|ดัง
modern|ทันสมัย
narrow|แคบ
necessary|จำเป็น
nervous|ประหม่า
new|ใหม่
noisy|เสียงอึกทึก
official|อย่างเป็นทางการ
ordinary|ธรรมดา
patient|อดทน
quiet|เงียบ
`,
    'adv.': `
abroad|ในต่างประเทศ
absolutely|อย่างเต็มร้อย
accidentally|โดยบังเอิญ
actually|อันที่จริง
afterward|ภายหลัง
again|อีกครั้ง
ahead|ไปข้างหน้า
almost|เกือบจะ
alone|ตามลำพัง
already|เรียบร้อยแล้ว
also|ด้วยเช่นกัน
always|เสมอ
annually|ทุกปี
anywhere|ที่ไหนก็ได้
apparently|ดูเหมือนว่า
approximately|โดยประมาณ
badly|อย่างแย่
barely|แทบจะไม่
beforehand|ล่วงหน้า
briefly|อย่างสั้น ๆ
certainly|อย่างแน่นอน
clearly|อย่างชัดเจน
closely|อย่างใกล้ชิด
completely|อย่างสมบูรณ์
correctly|อย่างถูกต้อง
currently|ในขณะนี้
daily|ทุกวัน
definitely|โดยไม่มีข้อสงสัย
easily|อย่างง่ายดาย
elsewhere|ที่อื่น
especially|โดยเฉพาะ
eventually|ในที่สุด
everywhere|ทุกแห่ง
exactly|ตรงเป๊ะ
extremely|อย่างยิ่ง
fairly|ค่อนข้าง
finally|สุดท้าย
firstly|ประการแรก
fluently|อย่างคล่องแคล่ว
fortunately|โชคดีที่
frequently|บ่อยครั้ง
fully|อย่างเต็มที่
generally|โดยทั่วไป
gently|อย่างเบามือ
gradually|ทีละน้อย
hardly|แทบไม่
here|ที่นี่
honestly|พูดตามตรง
hopefully|หวังว่า
however|อย่างไรก็ตาม
indoors|ในอาคาร
instead|แทน
intentionally|โดยตั้งใจ
jointly|ร่วมกัน
kindly|อย่างกรุณา
lately|ช่วงที่ผ่านมา
locally|ในท้องถิ่น
loudly|เสียงดัง
mainly|เป็นหลัก
meanwhile|ในระหว่างนั้น
merely|เพียงเท่านั้น
monthly|ทุกเดือน
mostly|ส่วนใหญ่
naturally|ตามธรรมชาติ
never|ไม่เคย
normally|ตามปกติ
now|ตอนนี้
often|บ่อย ๆ
online|ทางออนไลน์
openly|อย่างเปิดเผย
outdoors|กลางแจ้ง
partly|บางส่วน
personally|โดยส่วนตัว
politely|อย่างสุภาพ
quickly|อย่างรวดเร็ว
`,
  };
  const existingWords = [...new Map(DECKS.concat(PARTS_OF_SPEECH).flatMap((deck) => deck.w)
    .map((word) => [word[0], word.slice(0, 3)])).values()];
  window.VOCAB_FLASH_WORDS = existingWords.concat(Object.entries(FLASH_WORDS_BY_PART).flatMap(([part, words]) =>
    words.trim().split('\n').map((line) => {
      const [term, meaning] = line.trim().split('|');
      return [term, part, meaning];
    })));

  window.VOCAB_UNITS = DECKS.concat(PARTS_OF_SPEECH).map((D, n) => ({
    id: 'ev-' + D.id, n: n + 1, title: D.title, th: D.th, en: D.title, color: D.color, dark: D.dark, text: '#fff',
    lessons: [{ id: 'ev-' + D.id + '-1', title: D.th + ' · 10 คำ', en: D.title + ' · 10 words', questions: lesson(D) }]
  }));
})();
