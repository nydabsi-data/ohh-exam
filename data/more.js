/* Extra lessons (added 2026-11). Original questions written for Ohh-Exam.
   Appended to the end of existing units, so earlier lesson ids and progress are untouched.
   Pilot: English question, Thai explanation. Physics: Thai, g = 10 m/s².
   d = difficulty 1 ง่าย / 2 ปานกลาง / 3 ยาก. */
(function () {
  var PILOT = {
    pof: { id: 'pof-3', title: 'Stability & drag', questions: [
      { type: 'mc', d: 2, q: 'Moving the centre of gravity aft (rearward) generally:', o: ['Reduces longitudinal stability', 'Increases longitudinal stability', 'Has no effect on stability', 'Makes the aircraft impossible to stall'], a: 0,
        ex: 'CG ยิ่งถอยไปด้านหลัง เสถียรภาพตามยาวยิ่งลดลง เครื่องจะไวต่อการบังคับมากขึ้น ถ้าเกินขีดจำกัดท้ายอาจควบคุมยาก' },
      { type: 'tf', d: 1, q: 'Wing dihedral improves lateral (roll) stability.', a: true,
        ex: 'ปีกที่ยกทำมุมขึ้น (dihedral) ช่วยให้เครื่องกลับสู่ระดับปีกเองเมื่อถูกรบกวน จึงเพิ่มเสถียรภาพด้านข้าง' },
      { type: 'mc', d: 2, q: 'Induced drag is greatest when the aircraft is flying:', o: ['Slowly, at a high angle of attack', 'Fast, at a low angle of attack', 'At cruise speed', 'With the engine at idle'], a: 0,
        ex: 'แรงต้านเหนี่ยวนำเกิดจากการสร้างแรงยก ยิ่งบินช้าและมุมปะทะสูง แรงต้านเหนี่ยวนำยิ่งมาก' },
      { type: 'mc', d: 2, q: 'If airspeed doubles, parasite drag becomes about:', o: ['Four times as large', 'Twice as large', 'The same', 'Half as large'], a: 0,
        ex: 'แรงต้านรูปทรง (parasite drag) แปรผันตามความเร็วยกกำลังสอง ความเร็ว 2 เท่า แรงต้านจึงเพิ่มประมาณ 4 เท่า' },
      { type: 'mc', d: 3, q: 'The best glide range (furthest distance) is achieved at the speed for:', o: ['The maximum lift-to-drag ratio', 'Minimum rate of sink', 'Maximum speed', 'The stall speed'], a: 0,
        ex: 'ร่อนได้ไกลที่สุดที่ L/D สูงสุด (แรงต้านรวมต่ำสุด) ส่วนความเร็ว minimum sink ทำให้อยู่ในอากาศได้นานที่สุด ไม่ใช่ไกลที่สุด' },
      { type: 'tf', d: 2, q: 'The same aircraft has a higher stall speed when it is heavier.', a: true,
        ex: 'น้ำหนักมากขึ้นต้องการแรงยกมากขึ้น จึงต้องใช้ความเร็วสูงขึ้นที่มุมปะทะวิกฤตเดิม ความเร็ว stall จึงสูงขึ้น' }
    ] },
    met: { id: 'met-3', title: 'Fronts, icing & storms', questions: [
      { type: 'mc', d: 2, q: 'The passage of a cold front is usually marked by:', o: ['Cumuliform cloud, showers and gusty winds', 'Steady drizzle for many hours', 'A rise in temperature after it passes', 'Thick fog that lasts all day'], a: 0,
        ex: 'แนวปะทะอากาศเย็นดันอากาศอุ่นขึ้นอย่างรวดเร็ว ทำให้เกิดเมฆก้อน ฝนซู่ ลมกระโชก และอุณหภูมิลดลงหลังแนวผ่านไป' },
      { type: 'mc', d: 2, q: 'The dry adiabatic lapse rate is about:', o: ['3 °C per 1,000 ft', '2 °C per 1,000 ft', '1.5 °C per 1,000 ft', '6 °C per 1,000 ft'], a: 0,
        ex: 'อากาศแห้งที่ยกตัวเย็นลงประมาณ 3 °C ต่อ 1,000 ft (≈ 9.8 °C/km) ต่างจาก ISA ที่ใช้ 2 °C ต่อ 1,000 ft' },
      { type: 'tf', d: 2, q: 'Airframe icing is most likely in visible moisture at temperatures between 0 °C and about −20 °C.', a: true,
        ex: 'น้ำแข็งเกาะลำตัวเกิดเมื่อบินในเมฆหรือฝน (ความชื้นที่มองเห็นได้) ที่อุณหภูมิต่ำกว่า 0 °C โดยเฉพาะช่วง 0 ถึง −20 °C' },
      { type: 'mc', d: 3, q: 'Flying into a microburst on final approach, the first effect is usually:', o: ['An increase in headwind and airspeed', 'An immediate loss of airspeed', 'Severe icing', 'A loss of radio contact'], a: 0,
        ex: 'ช่วงแรกเจอลมปะทะหน้า ความเร็วเพิ่ม จากนั้นเจอลมดิ่งลงแรงและลมส่งท้าย ความเร็วและความสูงลดลงอย่างอันตราย' },
      { type: 'mc', d: 1, q: 'Which stage of a thunderstorm consists mainly of updrafts?', o: ['Cumulus (developing) stage', 'Mature stage', 'Dissipating stage', 'All stages equally'], a: 0,
        ex: 'ระยะก่อตัว (cumulus) มีแต่กระแสอากาศขึ้น ระยะเจริญเต็มที่มีทั้งขึ้นและลง ระยะสลายตัวมีกระแสลงเป็นหลัก' },
      { type: 'mc', d: 2, q: 'A temperature inversion is a layer in which temperature:', o: ['Increases with height', 'Decreases with height faster than normal', 'Stays exactly at ISA', 'Is always below 0 °C'], a: 0,
        ex: 'Inversion คือชั้นที่อุณหภูมิสูงขึ้นตามความสูง อากาศจึงนิ่ง กักหมอก ควัน และฝุ่นไว้ด้านล่าง' }
    ] },
    nav: { id: 'nav-3', title: 'Speed, time & fuel', questions: [
      { type: 'mc', d: 1, q: 'TAS 120 kt with a direct headwind of 20 kt gives a groundspeed of:', o: ['100 kt', '140 kt', '120 kt', '20 kt'], a: 0,
        ex: 'ลมปะทะหน้าตรง ๆ ลบออกจาก TAS ได้เลย: 120 − 20 = 100 kt' },
      { type: 'mc', d: 2, q: 'How long does it take to fly 90 NM at a groundspeed of 180 kt?', o: ['30 minutes', '2 hours', '50 minutes', '18 minutes'], a: 0,
        ex: 'เวลา = ระยะทาง ÷ ความเร็ว = 90 ÷ 180 = 0.5 ชั่วโมง = 30 นาที' },
      { type: 'mc', d: 2, q: 'Fuel flow is 8 US gal per hour. How much fuel is used in 1 h 30 min?', o: ['12 US gal', '9.5 US gal', '16 US gal', '10 US gal'], a: 0,
        ex: '8 × 1.5 = 12 US gal' },
      { type: 'mc', d: 3, q: 'Using the 1-in-60 rule: after 60 NM you are 3 NM left of track. Your track error is about:', o: ['3°', '6°', '1°', '20°'], a: 0,
        ex: 'กฎ 1-in-60: คลาด 1 NM ในระยะ 60 NM ≈ 1° ดังนั้นคลาด 3 NM ใน 60 NM ≈ 3°' },
      { type: 'tf', d: 2, q: 'If the wind blows from the left of track, the aircraft must be headed slightly left of the track to stay on it.', a: true,
        ex: 'ต้องหันหัวเข้าหาลม (crab into wind) ลมมาจากซ้ายจึงต้องตั้ง heading ไปทางซ้ายของ track เพื่อชดเชยการดริฟต์' },
      { type: 'mc', d: 2, q: 'At a constant indicated airspeed, as altitude increases the true airspeed:', o: ['Increases', 'Decreases', 'Stays the same', 'Becomes zero'], a: 0,
        ex: 'ที่สูงอากาศเบาบาง ต้องบินด้วย TAS สูงขึ้นจึงจะได้ IAS เท่าเดิม (ประมาณ +2% ต่อ 1,000 ft)' }
    ] },
    law: { id: 'law-3', title: 'Airspace, lights & signals', questions: [
      { type: 'mc', d: 1, q: 'In which ICAO airspace class is VFR flight not permitted?', o: ['Class A', 'Class C', 'Class D', 'Class G'], a: 0,
        ex: 'Class A อนุญาตเฉพาะเที่ยวบิน IFR เท่านั้น' },
      { type: 'mc', d: 2, q: 'An aircraft in flight receives a steady green light from the tower. This means:', o: ['Cleared to land', 'Return for landing', 'Give way and continue circling', 'Airport unsafe, do not land'], a: 0,
        ex: 'สัญญาณไฟเขียวค้างถึงเครื่องที่บินอยู่ = อนุญาตให้ลงจอด (ไฟเขียวกะพริบ = กลับมาเพื่อลงจอด)' },
      { type: 'mc', d: 2, q: 'A steady red light from the tower to an aircraft in flight means:', o: ['Give way to other aircraft and continue circling', 'Cleared to land', 'Return for landing', 'Land and go to the apron'], a: 0,
        ex: 'ไฟแดงค้างถึงเครื่องที่บินอยู่ = หลีกทางให้เครื่องอื่นและบินวนต่อ (ไฟแดงกะพริบ = สนามไม่ปลอดภัย ห้ามลง)' },
      { type: 'tf', d: 2, q: 'A flight plan must be filed for a flight that will cross an international border.', a: true,
        ex: 'ตามกฎ ICAO เที่ยวบินที่ข้ามพรมแดนระหว่างประเทศต้องยื่นแผนการบิน' },
      { type: 'mc', d: 2, q: 'The pilot-in-command of an aircraft:', o: ['Has final authority over the operation of the aircraft', 'Must follow instructions from passengers', 'Is responsible only during take-off and landing', 'Shares authority equally with every crew member'], a: 0,
        ex: 'นักบินผู้บังคับบัญชา (PIC) มีอำนาจสูงสุดและรับผิดชอบการปฏิบัติการของอากาศยานตลอดเที่ยวบิน' },
      { type: 'mc', d: 1, q: 'The navigation light on the right (starboard) wingtip is:', o: ['Green', 'Red', 'White', 'Amber'], a: 0,
        ex: 'ปลายปีกขวา = เขียว ปลายปีกซ้าย = แดง ท้ายเครื่อง = ขาว' }
    ] },
    agk: { id: 'agk-2', title: 'Engines & systems', questions: [
      { type: 'mc', d: 1, q: 'The order of a four-stroke piston engine cycle is:', o: ['Intake, compression, power, exhaust', 'Compression, intake, exhaust, power', 'Intake, power, compression, exhaust', 'Power, intake, exhaust, compression'], a: 0,
        ex: 'ดูด → อัด → ระเบิด (กำลัง) → คาย' },
      { type: 'mc', d: 2, q: 'Applying carburettor heat normally makes engine RPM:', o: ['Drop slightly', 'Rise sharply', 'Stay exactly the same', 'Fall to zero'], a: 0,
        ex: 'อากาศอุ่นมีความหนาแน่นน้อยลง RPM จึงลดลงเล็กน้อย ถ้ามีน้ำแข็งอยู่ RPM จะเพิ่มขึ้นหลังจากน้ำแข็งละลาย' },
      { type: 'tf', d: 2, q: 'The magnetos keep supplying the spark plugs even if the battery and alternator fail.', a: true,
        ex: 'แมกนีโตผลิตไฟจุดระเบิดเองจากการหมุนของเครื่องยนต์ ไม่ต้องพึ่งแบตเตอรี่หรืออัลเทอร์เนเตอร์' },
      { type: 'mc', d: 2, q: 'Detonation is most likely to be caused by:', o: ['Fuel with too low an octane rating', 'A mixture that is too rich', 'A cylinder that is too cold', 'Using carburettor heat'], a: 0,
        ex: 'เชื้อเพลิงค่าออกเทนต่ำกว่าที่กำหนด ส่วนผสมบางเกินไป หรือเครื่องร้อนจัด ทำให้เกิดการระเบิดผิดจังหวะ (detonation)' },
      { type: 'mc', d: 2, q: 'The mixture is leaned when climbing to altitude because:', o: ['The air is less dense, so the mixture becomes too rich', 'The air is denser, so more fuel is needed', 'It prevents carburettor icing', 'The fuel pump works harder'], a: 0,
        ex: 'ที่สูงอากาศเบาบางลงแต่น้ำมันไหลเท่าเดิม ส่วนผสมจึงหนาเกินไป ต้องลด mixture ให้สมดุล' },
      { type: 'mc', d: 2, q: 'A failure of the vacuum (suction) system mainly affects:', o: ['The attitude indicator and heading indicator', 'The airspeed indicator and altimeter', 'The magnetic compass', 'The fuel gauges'], a: 0,
        ex: 'เครื่องวัดท่าทาง (AI) และเครื่องวัดทิศทาง (HI) ในเครื่องบินเล็กส่วนใหญ่หมุนไจโรด้วยระบบสุญญากาศ' }
    ] },
    hfr: { id: 'hfr-3', title: 'Fitness to fly', questions: [
      { type: 'tf', d: 2, q: 'Flying soon after scuba diving increases the risk of decompression sickness.', a: true,
        ex: 'หลังดำน้ำ ร่างกายยังมีไนโตรเจนละลายอยู่ ความดันที่ลดลงเมื่อขึ้นสูงทำให้เกิดฟองก๊าซ (bends) ต้องรอตามเวลาที่กำหนดก่อนบิน' },
      { type: 'mc', d: 1, q: 'A common minimum rule is: no alcohol within how many hours before flying?', o: ['8 hours', '1 hour', '30 minutes', 'None, if you feel fine'], a: 0,
        ex: 'กฎขั้นต่ำที่ใช้กันทั่วไปคือ 8 ชั่วโมง ("bottle to throttle") และระดับแอลกอฮอล์ต้องอยู่ในเกณฑ์ที่กฎหมายกำหนด' },
      { type: 'mc', d: 2, q: 'Hyperventilation is caused by:', o: ['Breathing too fast or too deeply, losing CO₂', 'Too little oxygen at altitude', 'Carbon monoxide from the heater', 'Drinking too little water'], a: 0,
        ex: 'หายใจเร็วหรือลึกเกินไปทำให้ CO₂ ในเลือดต่ำ อาการคล้าย hypoxia แก้โดยหายใจช้าลง ส่วนข้อ 2 คือ hypoxia' },
      { type: 'mc', d: 2, q: 'In a piston aircraft, carbon monoxide poisoning most often comes from:', o: ['A leaking exhaust or cabin heater', 'The fuel tanks', 'The pitot-static system', 'The oxygen system'], a: 0,
        ex: 'ฮีตเตอร์ห้องโดยสารมักใช้ความร้อนจากท่อไอเสีย ถ้าท่อรั่ว CO ซึ่งไม่มีสีไม่มีกลิ่นจะเข้าห้องนักบินได้' },
      { type: 'tf', d: 1, q: 'Fatigue can reduce judgement and slow reaction time.', a: true,
        ex: 'ความเหนื่อยล้าทำให้การตัดสินใจแย่ลงและตอบสนองช้า เป็นปัจจัยสำคัญของอุบัติเหตุ' },
      { type: 'mc', d: 2, q: 'Spatial disorientation is most likely when:', o: ['Flying in cloud or at night without visual references', 'Flying in clear daylight with a visible horizon', 'Taxiing on the ground', 'Flying straight and level in good visibility'], a: 0,
        ex: 'เมื่อไม่มีเส้นขอบฟ้าให้อ้างอิง หูชั้นในหลอกความรู้สึกได้ง่าย ต้องเชื่อเครื่องวัดประกอบการบิน' }
    ] }
  };

  var PHYS = {
    'phy-kin': { id: 'phy-kin-3', title: 'กราฟการเคลื่อนที่', en: 'Motion graphs', questions: [
      { type: 'mc', d: 1, q: 'ความชันของกราฟตำแหน่งกับเวลา (x–t) บอกปริมาณใด', o: ['ความเร็ว', 'ความเร่ง', 'การกระจัดรวม', 'แรง'], a: 0,
        ex: 'ความชันของ x–t = Δx/Δt = ความเร็ว' },
      { type: 'mc', d: 2, q: 'พื้นที่ใต้กราฟความเร็วกับเวลา (v–t) บอกปริมาณใด', o: ['การกระจัด', 'ความเร่ง', 'อัตราเร็วเฉลี่ย', 'มวล'], a: 0,
        ex: 'พื้นที่ใต้กราฟ v–t = การกระจัด ส่วนความชันของ v–t = ความเร่ง' },
      { type: 'mc', d: 2, q: 'วัตถุเริ่มจากหยุดนิ่ง เร่งด้วยความเร่งคงที่ 2 m/s² นาน 5 s ได้ระยะทางเท่าใด', o: ['25 m', '10 m', '50 m', '5 m'], a: 0,
        ex: 's = ut + ½at² = 0 + ½ × 2 × 5² = 25 m' },
      { type: 'mc', d: 3, q: 'รถวิ่งด้วยความเร็ว 20 m/s แล้วเบรกด้วยความหน่วง 5 m/s² จนหยุด ได้ระยะทางเท่าใด', o: ['40 m', '20 m', '80 m', '100 m'], a: 0,
        ex: 'v² = u² + 2as → 0 = 20² − 2 × 5 × s → s = 400 ÷ 10 = 40 m' },
      { type: 'tf', d: 2, q: 'ถ้ากราฟ v–t เป็นเส้นตรงขนานกับแกนเวลา แสดงว่าความเร่งเป็นศูนย์', a: true,
        ex: 'เส้นขนานแกนเวลามีความชันเป็นศูนย์ ความเร็วคงที่ ความเร่งจึงเป็นศูนย์' }
    ] },
    'phy-force': { id: 'phy-force-3', title: 'น้ำหนัก แรงตึงเชือก และลิฟต์', en: 'Weight, tension and lifts', questions: [
      { type: 'mc', d: 1, q: 'วัตถุมวล 5 kg มีน้ำหนักเท่าใด', o: ['50 N', '5 N', '0.5 N', '500 N'], a: 0,
        ex: 'W = mg = 5 × 10 = 50 N' },
      { type: 'tf', d: 1, q: 'มวลของนักบินอวกาศบนดวงจันทร์น้อยกว่ามวลบนโลก', a: false,
        ex: 'มวลเท่าเดิมทุกที่ แต่น้ำหนักบนดวงจันทร์น้อยลง (ประมาณ 1/6) เพราะ g น้อยกว่า' },
      { type: 'mc', d: 2, q: 'คนมวล 60 kg ยืนในลิฟต์ที่กำลังเร่งขึ้น 2 m/s² พื้นลิฟต์ดันคนด้วยแรงเท่าใด', o: ['720 N', '600 N', '480 N', '120 N'], a: 0,
        ex: 'N − mg = ma → N = m(g + a) = 60 × 12 = 720 N คนจึงรู้สึกตัวหนักขึ้น' },
      { type: 'mc', d: 3, q: 'กล่อง 2 kg และ 3 kg ผูกเชือกต่อกันบนพื้นลื่น ดึงกล่อง 3 kg ด้วยแรง 10 N แรงตึงเชือกระหว่างกล่องเท่าใด', o: ['4 N', '6 N', '10 N', '2 N'], a: 0,
        ex: 'a = 10 ÷ (2 + 3) = 2 m/s² เชือกดึงกล่อง 2 kg: T = 2 × 2 = 4 N' },
      { type: 'mc', d: 2, q: 'แรงกิริยาและแรงปฏิกิริยาตามกฎข้อ 3 ของนิวตันมีลักษณะอย่างไร', o: ['ขนาดเท่ากัน ทิศตรงข้าม กระทำต่อวัตถุคนละก้อน', 'ขนาดเท่ากัน ทิศตรงข้าม กระทำต่อวัตถุก้อนเดียวกัน', 'ขนาดไม่เท่ากัน ทิศตรงข้าม', 'ขนาดเท่ากัน ทิศเดียวกัน'], a: 0,
        ex: 'แรงคู่กิริยา–ปฏิกิริยากระทำต่อวัตถุคนละก้อน จึงไม่หักล้างกัน' }
    ] },
    'phy-energy': { id: 'phy-energy-3', title: 'กำลังและการอนุรักษ์พลังงาน', en: 'Power and conservation of energy', questions: [
      { type: 'mc', d: 1, q: 'เครื่องยนต์ทำงานได้ 600 J ในเวลา 3 s มีกำลังเท่าใด', o: ['200 W', '1800 W', '600 W', '0.005 W'], a: 0,
        ex: 'P = W ÷ t = 600 ÷ 3 = 200 W' },
      { type: 'mc', d: 2, q: 'ปล่อยวัตถุจากความสูง 5 m (ไม่คิดแรงต้านอากาศ) ความเร็วขณะกระทบพื้นเท่าใด', o: ['10 m/s', '5 m/s', '50 m/s', '100 m/s'], a: 0,
        ex: 'mgh = ½mv² → v = √(2gh) = √(2 × 10 × 5) = 10 m/s' },
      { type: 'mc', d: 2, q: 'สปริงค่านิจ 200 N/m ถูกอัดเข้าไป 0.1 m มีพลังงานศักย์ยืดหยุ่นเท่าใด', o: ['1 J', '2 J', '20 J', '10 J'], a: 0,
        ex: 'Ep = ½kx² = ½ × 200 × 0.1² = 1 J' },
      { type: 'tf', d: 2, q: 'ในการชนแบบยืดหยุ่นสมบูรณ์ พลังงานจลน์รวมก่อนชนเท่ากับหลังชน', a: true,
        ex: 'ชนแบบยืดหยุ่น: ทั้งโมเมนตัมและพลังงานจลน์อนุรักษ์ ชนแบบไม่ยืดหยุ่น: อนุรักษ์เฉพาะโมเมนตัม' },
      { type: 'mc', d: 3, q: 'ยกกล่องมวล 20 kg ขึ้นสูง 3 m ด้วยความเร็วคงที่ในเวลา 4 s กำลังเฉลี่ยเท่าใด', o: ['150 W', '600 W', '240 W', '60 W'], a: 0,
        ex: 'งาน = mgh = 20 × 10 × 3 = 600 J กำลัง = 600 ÷ 4 = 150 W' }
    ] },
    'phy-motion': { id: 'phy-motion-2', title: 'โพรเจกไทล์และวงกลม (เจาะลึก)', en: 'Projectile and circular motion in depth', questions: [
      { type: 'mc', d: 2, q: 'ขว้างลูกบอลในแนวระดับจากหน้าผาสูง 20 m ลูกบอลใช้เวลาเท่าใดจึงถึงพื้น', o: ['2 s', '4 s', '1 s', '20 s'], a: 0,
        ex: 'แนวดิ่งเหมือนตกอิสระ: h = ½gt² → 20 = 5t² → t = 2 s (ไม่ขึ้นกับความเร็วแนวระดับ)' },
      { type: 'mc', d: 2, q: 'ขว้างวัตถุแนวระดับด้วยความเร็ว 15 m/s จากที่สูง 20 m วัตถุตกห่างจากจุดใต้ตำแหน่งขว้างเท่าใด', o: ['30 m', '15 m', '20 m', '60 m'], a: 0,
        ex: 'เวลาตก = 2 s ระยะแนวระดับ = 15 × 2 = 30 m' },
      { type: 'tf', d: 1, q: 'ที่จุดสูงสุดของการเคลื่อนที่แบบโพรเจกไทล์ ความเร็วในแนวดิ่งเป็นศูนย์', a: true,
        ex: 'ที่จุดสูงสุดเหลือเพียงความเร็วแนวระดับ ความเร็วแนวดิ่งเป็นศูนย์ แต่ความเร่งยังเป็น g ลงเสมอ' },
      { type: 'mc', d: 2, q: 'ยิงวัตถุด้วยอัตราเร็วเท่ากันบนพื้นราบ (ไม่คิดแรงต้าน) มุมใดได้ระยะทางแนวระดับไกลที่สุด', o: ['45°', '30°', '60°', '90°'], a: 0,
        ex: 'R = u² sin2θ / g มีค่ามากสุดเมื่อ sin2θ = 1 คือ θ = 45°' },
      { type: 'mc', d: 3, q: 'ยิงวัตถุด้วยความเร็ว 20 m/s ทำมุม 30° กับแนวระดับ วัตถุขึ้นไปได้สูงสุดเท่าใด', o: ['5 m', '10 m', '20 m', '2.5 m'], a: 0,
        ex: 'ความเร็วแนวดิ่ง = 20 sin30° = 10 m/s → H = v² / 2g = 100 ÷ 20 = 5 m' },
      { type: 'mc', d: 2, q: 'วัตถุเคลื่อนที่เป็นวงกลมรัศมี 2 m ด้วยอัตราเร็ว 4 m/s ความเร่งสู่ศูนย์กลางเท่าใด', o: ['8 m/s²', '2 m/s²', '16 m/s²', '32 m/s²'], a: 0,
        ex: 'a = v² / r = 16 ÷ 2 = 8 m/s²' }
    ] },
    'phy-wave': { id: 'phy-wave-3', title: 'การแทรกสอด การเลี้ยวเบน และดอปเพลอร์', en: 'Interference, diffraction and Doppler', questions: [
      { type: 'mc', d: 1, q: 'คลื่นความถี่ 50 Hz ความยาวคลื่น 2 m มีอัตราเร็วเท่าใด', o: ['100 m/s', '25 m/s', '52 m/s', '0.04 m/s'], a: 0,
        ex: 'v = fλ = 50 × 2 = 100 m/s' },
      { type: 'tf', d: 2, q: 'เมื่อแหล่งกำเนิดเสียงเคลื่อนที่เข้าหาผู้ฟัง ผู้ฟังได้ยินเสียงความถี่สูงขึ้น', a: true,
        ex: 'ปรากฏการณ์ดอปเพลอร์: เข้าหากันได้ยินเสียงแหลมขึ้น เคลื่อนออกห่างได้ยินเสียงทุ้มลง' },
      { type: 'mc', d: 2, q: 'การแทรกสอดแบบเสริมเกิดเมื่อผลต่างระยะทางเดินของคลื่นสองขบวน (เฟสตรงกันที่แหล่งกำเนิด) เท่ากับ', o: ['จำนวนเต็มเท่าของความยาวคลื่น', 'ครึ่งหนึ่งของความยาวคลื่น', '1.5 เท่าของความยาวคลื่น', '¼ ของความยาวคลื่น'], a: 0,
        ex: 'เสริม: ผลต่างทางเดิน = nλ หักล้าง: ผลต่างทางเดิน = (n + ½)λ' },
      { type: 'mc', d: 3, q: 'เสียงระดับ 80 dB มีความเข้มเสียงมากกว่าเสียงระดับ 60 dB กี่เท่า', o: ['100 เท่า', '20 เท่า', '2 เท่า', '10 เท่า'], a: 0,
        ex: 'ทุก ๆ 10 dB ความเข้มเพิ่ม 10 เท่า ต่างกัน 20 dB = 10 × 10 = 100 เท่า' },
      { type: 'mc', d: 2, q: 'ได้ยินเสียงคนพูดจากอีกห้องผ่านประตูที่เปิดอยู่ แม้มองไม่เห็นตัว เป็นผลจากปรากฏการณ์ใดเป็นหลัก', o: ['การเลี้ยวเบน', 'การหักเห', 'การโพลาไรซ์', 'การกระเจิงของแสง'], a: 0,
        ex: 'เสียงมีความยาวคลื่นใกล้เคียงขนาดประตู จึงเลี้ยวเบนอ้อมขอบประตูได้ดี ส่วนแสงความยาวคลื่นสั้นมากจึงเลี้ยวเบนน้อย' }
    ] },
    'phy-elec': { id: 'phy-elec-3', title: 'วงจรไฟฟ้าและค่าไฟ', en: 'Circuits and electrical energy', questions: [
      { type: 'mc', d: 1, q: 'ตัวต้านทาน 4 Ω และ 6 Ω ต่อแบบอนุกรม ความต้านทานรวมเท่าใด', o: ['10 Ω', '2.4 Ω', '24 Ω', '2 Ω'], a: 0,
        ex: 'อนุกรม: R = 4 + 6 = 10 Ω' },
      { type: 'mc', d: 2, q: 'ตัวต้านทาน 6 Ω และ 3 Ω ต่อแบบขนาน ความต้านทานรวมเท่าใด', o: ['2 Ω', '9 Ω', '18 Ω', '4.5 Ω'], a: 0,
        ex: 'ขนาน: R = (6 × 3) ÷ (6 + 3) = 18 ÷ 9 = 2 Ω' },
      { type: 'mc', d: 2, q: 'หลอดไฟ 100 W เปิดวันละ 10 ชั่วโมง นาน 30 วัน ใช้พลังงานไฟฟ้ากี่หน่วย (kWh)', o: ['30 หน่วย', '3 หน่วย', '300 หน่วย', '3,000 หน่วย'], a: 0,
        ex: 'พลังงาน = 0.1 kW × 10 h × 30 วัน = 30 kWh = 30 หน่วย' },
      { type: 'tf', d: 1, q: 'เครื่องใช้ไฟฟ้าในบ้านต่อกันแบบขนาน', a: true,
        ex: 'ต่อแบบขนานทำให้ทุกเครื่องได้แรงดันเท่ากัน (220 V) และเปิดปิดแยกกันได้' },
      { type: 'mc', d: 3, q: 'แบตเตอรี่ emf 12 V ความต้านทานภายใน 1 Ω ต่อกับตัวต้านทาน 5 Ω กระแสในวงจรเท่าใด', o: ['2 A', '2.4 A', '12 A', '1 A'], a: 0,
        ex: 'I = E ÷ (R + r) = 12 ÷ (5 + 1) = 2 A' }
    ] },
    'phy-mag': { id: 'phy-mag-2', title: 'แรงแม่เหล็กและหม้อแปลง', en: 'Magnetic force and transformers', questions: [
      { type: 'mc', d: 2, q: 'ลวดยาว 0.5 m มีกระแส 4 A วางตั้งฉากกับสนามแม่เหล็ก 0.2 T แรงที่กระทำต่อลวดเท่าใด', o: ['0.4 N', '4 N', '0.1 N', '1.6 N'], a: 0,
        ex: 'F = ILB = 4 × 0.5 × 0.2 = 0.4 N' },
      { type: 'mc', d: 2, q: 'หม้อแปลงมีขดปฐมภูมิ 200 รอบ ขดทุติยภูมิ 1,000 รอบ ป้อนไฟ 220 V ได้แรงดันขาออกเท่าใด', o: ['1,100 V', '44 V', '220 V', '2,200 V'], a: 0,
        ex: 'Vs/Vp = Ns/Np → Vs = 220 × 1000/200 = 1,100 V (หม้อแปลงขึ้น)' },
      { type: 'tf', d: 1, q: 'นิวตรอนที่เคลื่อนที่ในสนามแม่เหล็กไม่ถูกแรงแม่เหล็กกระทำ', a: true,
        ex: 'แรงแม่เหล็ก F = qvB นิวตรอนไม่มีประจุ (q = 0) จึงไม่มีแรงกระทำ' },
      { type: 'mc', d: 2, q: 'หม้อแปลงไฟฟ้าใช้งานได้กับไฟฟ้าชนิดใด', o: ['ไฟฟ้ากระแสสลับ', 'ไฟฟ้ากระแสตรงเท่านั้น', 'ไฟฟ้าสถิต', 'ใช้ได้ทุกแบบเท่ากัน'], a: 0,
        ex: 'หม้อแปลงต้องการฟลักซ์แม่เหล็กที่เปลี่ยนแปลงตลอดเวลา จึงใช้กับไฟฟ้ากระแสสลับ' },
      { type: 'mc', d: 2, q: 'อิเล็กตรอนเคลื่อนที่ตั้งฉากกับสนามแม่เหล็กสม่ำเสมอ จะเคลื่อนที่แบบใด', o: ['เป็นวงกลม', 'เป็นเส้นตรงด้วยความเร็วคงที่', 'เป็นพาราโบลา', 'หยุดนิ่ง'], a: 0,
        ex: 'แรงแม่เหล็กตั้งฉากกับความเร็วตลอดเวลา ทำหน้าที่เป็นแรงสู่ศูนย์กลาง อนุภาคจึงเคลื่อนที่เป็นวงกลม' }
    ] },
    'phy-heat': { id: 'phy-heat-2', title: 'ความร้อนแฝงและแก๊ส', en: 'Latent heat and gases', questions: [
      { type: 'mc', d: 2, q: 'ต้องใช้ความร้อนเท่าใดทำให้น้ำ 2 kg อุณหภูมิเพิ่มขึ้น 10 °C (c = 4,200 J/kg·K)', o: ['84,000 J', '8,400 J', '42,000 J', '840 J'], a: 0,
        ex: 'Q = mcΔT = 2 × 4200 × 10 = 84,000 J' },
      { type: 'tf', d: 1, q: 'ขณะน้ำแข็งกำลังหลอมเหลว อุณหภูมิคงที่แม้ได้รับความร้อน', a: true,
        ex: 'ความร้อนที่ได้รับใช้เปลี่ยนสถานะ (ความร้อนแฝง) อุณหภูมิจึงคงที่ที่ 0 °C จนกว่าจะละลายหมด' },
      { type: 'mc', d: 2, q: 'แก๊สในภาชนะปิดปริมาตรคงที่ ถ้าอุณหภูมิสัมบูรณ์ (เคลวิน) เพิ่มเป็น 2 เท่า ความดันจะเป็นอย่างไร', o: ['เพิ่มเป็น 2 เท่า', 'ลดลงครึ่งหนึ่ง', 'เท่าเดิม', 'เพิ่มเป็น 4 เท่า'], a: 0,
        ex: 'ปริมาตรคงที่: P ∝ T (เคลวิน) T เพิ่ม 2 เท่า P จึงเพิ่ม 2 เท่า' },
      { type: 'mc', d: 3, q: 'ทำให้น้ำแข็ง 0.5 kg ที่ 0 °C หลอมเหลวหมด ต้องใช้ความร้อนเท่าใด (L = 334,000 J/kg)', o: ['167,000 J', '334,000 J', '668,000 J', '16,700 J'], a: 0,
        ex: 'Q = mL = 0.5 × 334,000 = 167,000 J' },
      { type: 'mc', d: 2, q: 'ความดันเกจของน้ำที่ความลึก 5 m เท่าใด (ρ = 1,000 kg/m³)', o: ['50,000 Pa', '5,000 Pa', '500 Pa', '500,000 Pa'], a: 0,
        ex: 'P = ρgh = 1000 × 10 × 5 = 50,000 Pa (ยังไม่รวมความดันบรรยากาศ)' }
    ] },
    'phy-modern': { id: 'phy-modern-2', title: 'ครึ่งชีวิตและโฟโตอิเล็กทริก', en: 'Half-life and the photoelectric effect', questions: [
      { type: 'mc', d: 2, q: 'ธาตุกัมมันตรังสีมีครึ่งชีวิต 2 วัน เวลาผ่านไป 6 วัน จะเหลือเท่าใดของปริมาณเดิม', o: ['1/8', '1/3', '1/6', '1/4'], a: 0,
        ex: '6 วัน = 3 ครึ่งชีวิต → (½)³ = 1/8' },
      { type: 'mc', d: 2, q: 'การสลายตัวแบบแอลฟา ทำให้เลขมวลและเลขอะตอมเปลี่ยนอย่างไร', o: ['เลขมวลลด 4 เลขอะตอมลด 2', 'เลขมวลลด 2 เลขอะตอมลด 4', 'เลขมวลคงเดิม เลขอะตอมเพิ่ม 1', 'ไม่เปลี่ยนทั้งคู่'], a: 0,
        ex: 'อนุภาคแอลฟาคือนิวเคลียสฮีเลียม (⁴₂He) จึงพาเลขมวล 4 และเลขอะตอม 2 ออกไป' },
      { type: 'tf', d: 2, q: 'ในปรากฏการณ์โฟโตอิเล็กทริก การเพิ่มความเข้มแสง (ความถี่เท่าเดิม) เพิ่มจำนวนโฟโตอิเล็กตรอน แต่ไม่เพิ่มพลังงานจลน์สูงสุด', a: true,
        ex: 'พลังงานจลน์สูงสุดขึ้นกับความถี่ (Ek = hf − W) ส่วนความเข้มแสงเพิ่มจำนวนโฟตอน จึงเพิ่มจำนวนอิเล็กตรอน' },
      { type: 'mc', d: 3, q: 'โลหะมีฟังก์ชันงาน 2.5 eV โฟโตอิเล็กตรอนมีพลังงานจลน์สูงสุด 1.5 eV โฟตอนที่ตกกระทบมีพลังงานเท่าใด', o: ['4.0 eV', '1.0 eV', '2.5 eV', '3.75 eV'], a: 0,
        ex: 'hf = W + Ek = 2.5 + 1.5 = 4.0 eV' },
      { type: 'mc', d: 1, q: 'การสลายตัวแบบบีตาลบ อนุภาคที่ถูกปล่อยออกมาคืออะไร', o: ['อิเล็กตรอน', 'โปรตอน', 'นิวเคลียสฮีเลียม', 'นิวตรอน'], a: 0,
        ex: 'บีตาลบ: นิวตรอนในนิวเคลียสเปลี่ยนเป็นโปรตอนและปล่อยอิเล็กตรอนออกมา' }
    ] }
  };

  function add(units, map) {
    (units || []).forEach(function (u) {
      var l = map[u.id];
      if (l && !u.lessons.some(function (x) { return x.id === l.id; })) u.lessons.push(l);
    });
  }
  add(window.UNITS, PILOT);
  add(window.PHYSICS_UNITS, PHYS);

  window.I18N_EXTRA = window.I18N_EXTRA || {};
  Object.keys(PHYS).forEach(function (k) { window.I18N_EXTRA[PHYS[k].title] = PHYS[k].en; });
})();
