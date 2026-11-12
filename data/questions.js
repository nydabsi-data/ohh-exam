/* Question bank.
   Types:
     mc    { type:'mc', q, o:[...options], a:<index of correct option>, ex }
     tf    { type:'tf', q, a:true|false, ex }
     match { type:'match', q, pairs:[[left,right], ...], ex }
   Lesson ids must stay unique and stable — progress is saved by id.
   NOTE: sample questions for building the app; verify against official material before real use. */
window.UNITS = [
  {
    id: 'pof', title: 'Principles of Flight', th: 'หลักการบิน', color: '#58CC02', dark: '#58A700',
    lessons: [
      {
        id: 'pof-1', title: 'Four forces & controls',
        questions: [
          { type: 'mc', q: 'In straight and level flight, which force directly opposes weight?', o: ['Lift', 'Thrust', 'Drag', 'Torque'], a: 0,
            ex: 'ในการบินระดับคงที่ แรงยก (Lift) สมดุลกับน้ำหนัก (Weight) และแรงขับ (Thrust) สมดุลกับแรงต้าน (Drag)' },
          { type: 'mc', q: 'Which force opposes drag?', o: ['Thrust', 'Lift', 'Weight', 'Centrifugal force'], a: 0,
            ex: 'Thrust ดันเครื่องบินไปข้างหน้า ส่วน Drag ต้านการเคลื่อนที่ไปข้างหน้า' },
          { type: 'match', q: 'Match each control surface with its movement', pairs: [['Ailerons', 'Roll'], ['Elevator', 'Pitch'], ['Rudder', 'Yaw']],
            ex: 'Ailerons = Roll รอบแกนตามยาว, Elevator = Pitch รอบแกนขวาง, Rudder = Yaw รอบแกนตั้ง' },
          { type: 'tf', q: "According to Bernoulli's principle, when the speed of airflow increases, its static pressure increases.", a: false,
            ex: 'อากาศไหลเร็วขึ้น ความดันสถิตจะลดลง จึงเกิดความดันต่ำเหนือปีกและเกิดแรงยก' },
          { type: 'mc', q: 'A wing stalls when:', o: ['The critical angle of attack is exceeded', 'Airspeed drops below 100 kt', 'The engine fails', 'The flaps are retracted'], a: 0,
            ex: 'Stall เกิดเมื่อมุมปะทะเกินมุมวิกฤต (critical angle of attack) ซึ่งเกิดได้ทุกความเร็วและทุกท่าทางการบิน' }
        ]
      },
      {
        id: 'pof-2', title: 'Lift, flaps & turns',
        questions: [
          { type: 'mc', q: 'Angle of attack is the angle between:', o: ['The chord line and the relative airflow', 'The chord line and the horizon', 'The longitudinal axis and the horizon', 'The wing and the fuselage'], a: 0,
            ex: 'มุมปะทะ = มุมระหว่างเส้นคอร์ดของปีกกับทิศทางลมสัมพัทธ์ ไม่ใช่มุมกับเส้นขอบฟ้า' },
          { type: 'mc', q: 'Extending trailing-edge flaps generally:', o: ['Increases both lift and drag', 'Decreases both lift and drag', 'Increases lift and reduces drag', 'Increases the stall speed'], a: 0,
            ex: 'แฟลปเพิ่มทั้งแรงยกและแรงต้าน ทำให้ความเร็ว stall ลดลง บินเข้าลงจอดได้ช้าลงและชันขึ้น' },
          { type: 'mc', q: 'In a level turn at 60° of bank, the load factor is:', o: ['2 g', '1 g', '1.5 g', '3 g'], a: 0,
            ex: 'Load factor = 1 / cos(bank) = 1 / cos 60° = 2' },
          { type: 'tf', q: 'Stall speed increases in a steep level turn.', a: true,
            ex: 'Load factor เพิ่มขึ้น ทำให้ stall speed เพิ่มตามรากที่สองของ load factor เช่นที่ 60° จะเพิ่มประมาณ 1.41 เท่า' },
          { type: 'mc', q: 'Wake turbulence is strongest behind an aircraft that is:', o: ['Heavy, clean and slow', 'Light, dirty and fast', 'Heavy and fast with flaps down', 'Light and slow'], a: 0,
            ex: 'จำว่า "Heavy, Clean, Slow" มุมปะทะสูงทำให้ wingtip vortices แรงที่สุด' },
          { type: 'tf', q: 'Ground effect reduces induced drag and can make an aircraft float during landing.', a: true,
            ex: 'ใกล้พื้น vortices ถูกจำกัด induced drag ลดลง เครื่องจึงลอยไกลกว่าที่คาดถ้าความเร็วเกิน' }
        ]
      }
    ]
  },
  {
    id: 'met', title: 'Meteorology', th: 'อุตุนิยมวิทยา', color: '#1CB0F6', dark: '#1899D6',
    lessons: [
      {
        id: 'met-1', title: 'ISA atmosphere',
        questions: [
          { type: 'mc', q: 'ISA mean sea level temperature is:', o: ['+15 °C', '0 °C', '+20 °C', '+10 °C'], a: 0,
            ex: 'International Standard Atmosphere กำหนดอุณหภูมิที่ระดับน้ำทะเลเป็น +15 °C' },
          { type: 'mc', q: 'ISA mean sea level pressure is:', o: ['1013.25 hPa', '1000 hPa', '1020.5 hPa', '29.29 inHg'], a: 0,
            ex: 'ความกดอากาศมาตรฐานที่ระดับน้ำทะเล = 1013.25 hPa หรือ 29.92 inHg' },
          { type: 'mc', q: 'The ISA temperature lapse rate in the troposphere is approximately:', o: ['2 °C per 1,000 ft', '3 °C per 1,000 ft', '1 °C per 1,000 ft', '0.5 °C per 1,000 ft'], a: 0,
            ex: 'อุณหภูมิลดลงประมาณ 1.98 °C ต่อ 1,000 ft (6.5 °C ต่อ 1 km) จนถึง tropopause' },
          { type: 'tf', q: 'In ISA, the tropopause is at about 36,090 ft with a temperature of −56.5 °C.', a: true,
            ex: 'Tropopause ใน ISA อยู่ที่ 11 km (~36,090 ft) อุณหภูมิ −56.5 °C และคงที่ต่อขึ้นไปช่วงหนึ่ง' },
          { type: 'tf', q: 'When the temperature and dew point are very close together, fog or low cloud is likely.', a: true,
            ex: 'Temperature/dew point spread แคบ = อากาศใกล้อิ่มตัว มีโอกาสเกิดหมอกหรือเมฆต่ำ' }
        ]
      },
      {
        id: 'met-2', title: 'METAR & clouds',
        questions: [
          { type: 'match', q: 'Match the METAR code with its meaning', pairs: [['BR', 'Mist'], ['FG', 'Fog'], ['TS', 'Thunderstorm'], ['HZ', 'Haze']],
            ex: 'BR = Mist, FG = Fog, TS = Thunderstorm, HZ = Haze' },
          { type: 'mc', q: 'Which cloud type is associated with thunderstorms?', o: ['Cumulonimbus (CB)', 'Cirrus (CI)', 'Stratus (ST)', 'Altostratus (AS)'], a: 0,
            ex: 'CB คือเมฆฝนฟ้าคะนอง มาพร้อม turbulence รุนแรง icing ลูกเห็บ และ windshear' },
          { type: 'tf', q: 'Wind direction in a METAR is given relative to true north.', a: true,
            ex: 'METAR/TAF ใช้ทิศจริง (True) ส่วนลมที่หอบังคับการบินหรือ ATIS แจ้งใช้ทิศแม่เหล็ก (Magnetic)' },
          { type: 'mc', q: 'CAVOK requires visibility of at least:', o: ['10 km', '5 km', '8 km', '1,500 m'], a: 0,
            ex: 'CAVOK = ทัศนวิสัย ≥ 10 km, ไม่มีเมฆต่ำกว่า 5,000 ft (หรือ MSA สูงสุด), ไม่มี CB/TCU และไม่มีสภาพอากาศสำคัญ' },
          { type: 'tf', q: 'Carburettor icing can occur even when the outside air temperature is well above 0 °C.', a: true,
            ex: 'อุณหภูมิใน carburettor ลดลงมากจากการขยายตัวและการระเหยของน้ำมัน จึงเกิดน้ำแข็งได้แม้อากาศภายนอกอุ่นและชื้น' }
        ]
      }
    ]
  },
  {
    id: 'nav', title: 'Navigation', th: 'การเดินอากาศ', color: '#CE82FF', dark: '#A568CC',
    lessons: [
      {
        id: 'nav-1', title: 'Units & distance',
        questions: [
          { type: 'mc', q: 'One nautical mile is equal to:', o: ['1,852 m', '1,609 m', '1,000 m', '6,076 m'], a: 0,
            ex: '1 NM = 1,852 m (ประมาณ 6,076 ft) ส่วน 1,609 m คือ statute mile' },
          { type: 'mc', q: 'One degree of latitude is equal to:', o: ['60 NM', '100 NM', '360 NM', '69 NM'], a: 0,
            ex: '1° latitude = 60 NM และ 1 minute = 1 NM' },
          { type: 'tf', q: 'A knot is a speed of one nautical mile per hour.', a: true,
            ex: '1 kt = 1 NM/h' },
          { type: 'mc', q: 'With a groundspeed of 120 kt, how long does it take to fly 30 NM?', o: ['15 minutes', '20 minutes', '25 minutes', '12 minutes'], a: 0,
            ex: '120 kt = 2 NM ต่อนาที ดังนั้น 30 ÷ 2 = 15 นาที' },
          { type: 'mc', q: 'Thailand local time is 14:00. What is the time in UTC?', o: ['07:00', '21:00', '14:00', '08:00'], a: 0,
            ex: 'ประเทศไทยคือ UTC+7 ดังนั้น 14:00 − 7 = 07:00 UTC' }
        ]
      },
      {
        id: 'nav-2', title: 'Headings & variation',
        questions: [
          { type: 'mc', q: 'Magnetic variation is the angle between:', o: ['True north and magnetic north', 'Magnetic north and compass north', 'Heading and track', 'True north and grid north'], a: 0,
            ex: 'Variation = มุมระหว่างทิศเหนือจริงกับเหนือแม่เหล็ก ส่วนระหว่างเหนือแม่เหล็กกับเข็มทิศคือ Deviation' },
          { type: 'mc', q: 'True heading 090°, variation 2° W. What is the magnetic heading?', o: ['092°', '088°', '090°', '270°'], a: 0,
            ex: 'จำว่า "Variation West, Magnetic Best" → บวก West: 090 + 2 = 092°' },
          { type: 'tf', q: 'Drift is the angle between heading and track.', a: true,
            ex: 'ลมพัดทำให้เส้นทางจริงบนพื้น (track) ต่างจากทิศหัวเครื่อง (heading) มุมนี้คือ drift' },
          { type: 'mc', q: '1 foot is equal to:', o: ['0.3048 m', '0.254 m', '0.5 m', '3.28 m'], a: 0,
            ex: '1 ft = 0.3048 m และ 1 m ≈ 3.28 ft' },
          { type: 'mc', q: 'An aircraft flies a heading of 360° but its track is 005°. The drift is:', o: ['5° right', '5° left', '0°', '10° right'], a: 0,
            ex: 'Track อยู่ขวาของ heading 5° แปลว่าลมพัดจากด้านซ้าย เครื่องจึง drift ไปทางขวา 5°' }
        ]
      }
    ]
  },
  {
    id: 'law', title: 'Air Law', th: 'กฎหมายการบิน', color: '#FF9600', dark: '#CC7800',
    lessons: [
      {
        id: 'law-1', title: 'Squawks & ICAO',
        questions: [
          { type: 'match', q: 'Match the transponder code with its meaning', pairs: [['7500', 'Unlawful interference'], ['7600', 'Radio failure'], ['7700', 'Emergency']],
            ex: 'จำว่า 75 = taken alive, 76 = radio fix, 77 = going to heaven' },
          { type: 'mc', q: 'ICAO stands for:', o: ['International Civil Aviation Organization', 'International Commercial Airline Organization', 'Intercontinental Civil Air Office', 'International Committee for Air Operations'], a: 0,
            ex: 'ICAO เป็นองค์การของสหประชาชาติที่กำหนดมาตรฐานการบินพลเรือนระหว่างประเทศ' },
          { type: 'match', q: 'Match the ICAO Annex with its subject', pairs: [['Annex 1', 'Personnel Licensing'], ['Annex 2', 'Rules of the Air'], ['Annex 6', 'Operation of Aircraft'], ['Annex 14', 'Aerodromes']],
            ex: 'Annex 1 ใบอนุญาตบุคลากร, Annex 2 กฎการบิน, Annex 6 การปฏิบัติการบิน, Annex 14 สนามบิน' },
          { type: 'tf', q: 'The Chicago Convention of 1944 created ICAO.', a: true,
            ex: 'อนุสัญญาชิคาโก (Convention on International Civil Aviation) ปี 1944 เป็นที่มาของ ICAO' },
          { type: 'mc', q: 'The national civil aviation authority of Thailand is:', o: ['CAAT', 'AOT', 'AEROTHAI', 'DCA Malaysia'], a: 0,
            ex: 'CAAT = สำนักงานการบินพลเรือนแห่งประเทศไทย ส่วน AOT ดูแลท่าอากาศยาน และ AEROTHAI ให้บริการจราจรทางอากาศ' }
        ]
      },
      {
        id: 'law-2', title: 'Right of way',
        questions: [
          { type: 'mc', q: 'Two aircraft are approaching head-on. What should they do?', o: ['Both alter heading to the right', 'Both alter heading to the left', 'The higher aircraft climbs', 'The faster aircraft gives way'], a: 0,
            ex: 'กรณีบินสวนกันตรงๆ ทั้งสองลำต้องเลี้ยวไปทางขวา' },
          { type: 'mc', q: 'Two aircraft are converging at about the same level. Which one gives way?', o: ['The one that has the other on its right', 'The one that has the other on its left', 'The faster one', 'The larger one'], a: 0,
            ex: 'ลำที่เห็นอีกลำอยู่ทางขวาของตนต้องหลีกทาง' },
          { type: 'tf', q: 'An overtaking aircraft must keep out of the way by altering heading to the right.', a: true,
            ex: 'ลำที่แซงต้องหลบไปทางขวา ส่วนลำที่ถูกแซงมีสิทธิ์ทาง' },
          { type: 'mc', q: 'Which of these has right of way over the others?', o: ['Balloon', 'Glider', 'Airship', 'Powered aeroplane'], a: 0,
            ex: 'ลำดับ: เครื่องบินมีเครื่องยนต์หลีกให้ airship, glider, balloon; airship หลีกให้ glider, balloon; glider หลีกให้ balloon' },
          { type: 'tf', q: 'An aircraft that is landing has right of way over aircraft in flight or on the ground.', a: true,
            ex: 'เครื่องบินที่กำลังลงจอดหรือในช่วงสุดท้ายของการเข้าลงจอดมีสิทธิ์ทางก่อน' }
        ]
      }
    ]
  },
  {
    id: 'agk', title: 'Aircraft & Instruments', th: 'ระบบอากาศยานและเครื่องวัด', color: '#FF4B4B', dark: '#EA2B2B',
    lessons: [
      {
        id: 'agk-1', title: 'Pitot-static system',
        questions: [
          { type: 'match', q: 'Match each instrument with the pressure it uses', pairs: [['Airspeed indicator', 'Pitot + static'], ['Altimeter', 'Static only'], ['Vertical speed indicator', 'Static (with a lag)']],
            ex: 'ASI ใช้ทั้ง pitot และ static ส่วน altimeter และ VSI ใช้ static อย่างเดียว' },
          { type: 'tf', q: 'If the pitot tube and its drain hole are blocked but the static port is open, the airspeed indicator acts like an altimeter.', a: true,
            ex: 'แรงดันใน pitot ถูกขังไว้ เมื่อไต่ระดับ static ลดลง ASI จึงแสดงค่าเพิ่มขึ้นเหมือน altimeter' },
          { type: 'mc', q: 'If the static port becomes blocked, the altimeter will:', o: ['Freeze at the altitude where the blockage occurred', 'Read zero', 'Show double the altitude', 'Work normally'], a: 0,
            ex: 'Altimeter ใช้ static อย่างเดียว เมื่อตันค่าจะค้างที่ระดับตอนที่ตัน (VSI จะชี้ศูนย์)' },
          { type: 'mc', q: 'Flying from a high-pressure area to a low-pressure area without resetting the altimeter, the aircraft will be:', o: ['Lower than indicated', 'Higher than indicated', 'At the indicated altitude', 'It depends on temperature only'], a: 0,
            ex: 'จำว่า "High to Low, look out below" altimeter จะอ่านค่าสูงกว่าความจริง' },
          { type: 'mc', q: 'The attitude indicator works on the gyroscopic principle of:', o: ['Rigidity in space', 'Precession', 'Magnetism', 'Static pressure'], a: 0,
            ex: 'Attitude indicator อาศัย rigidity in space ส่วน turn coordinator อาศัย precession' },
          { type: 'mc', q: 'AVGAS 100LL is dyed:', o: ['Blue', 'Green', 'Red', 'Clear'], a: 0,
            ex: '100LL สีฟ้า ส่วน Jet A-1 ใสหรือเหลืองอ่อน ต้องตรวจสีน้ำมันทุกครั้งตอน preflight' }
        ]
      }
    ]
  },
  {
    id: 'hfr', title: 'Radio & Human Factors', th: 'วิทยุสื่อสารและปัจจัยมนุษย์', color: '#2B70C9', dark: '#1F5AA6',
    lessons: [
      {
        id: 'hfr-1', title: 'Radiotelephony',
        questions: [
          { type: 'match', q: 'Match the letter with the ICAO phonetic word', pairs: [['T', 'Tango'], ['W', 'Whiskey'], ['X', 'X-ray'], ['Z', 'Zulu']],
            ex: 'ใช้ตัวอักษร ICAO ทุกครั้งเมื่อสะกด callsign หรือชื่อจุด' },
          { type: 'mc', q: '"WILCO" means:', o: ['I understand your message and will comply', 'I have received all of your last transmission', 'Yes', 'Say again'], a: 0,
            ex: 'WILCO = Will comply ส่วน ROGER แปลว่ารับข้อความแล้วเท่านั้น ไม่ได้แปลว่าจะทำตาม' },
          { type: 'mc', q: '"ROGER" means:', o: ['I have received all of your last transmission', 'I will comply', 'Yes', 'Permission granted'], a: 0,
            ex: 'ROGER ไม่ใช่คำตอบ yes/no และห้ามใช้ตอบคำถาม ถ้าตอบ yes ให้ใช้ AFFIRM' },
          { type: 'tf', q: 'The digit 9 is pronounced "NIN-er" in radiotelephony.', a: true,
            ex: 'ใช้ "Niner" เพื่อไม่ให้สับสนกับคำว่า "nein" ในภาษาเยอรมัน' }
        ]
      },
      {
        id: 'hfr-2', title: 'Human performance',
        questions: [
          { type: 'mc', q: 'Hypoxia is:', o: ['A lack of oxygen reaching the body tissues', 'Too much carbon dioxide in the blood', 'Fear of heights', 'Inner ear disorientation'], a: 0,
            ex: 'Hypoxia อันตรายเพราะอาการค่อยเป็นค่อยไปและมักรู้สึกดีหรือมั่นใจเกินจริง (euphoria)' },
          { type: 'tf', q: 'At night, an object is often seen better by looking slightly to one side of it.', a: true,
            ex: 'เซลล์ rods ที่ไวต่อแสงน้อยอยู่รอบนอกของจอตา จึงใช้ off-centre viewing ในที่มืด' },
          { type: 'mc', q: 'Full dark adaptation of the eyes takes about:', o: ['30 minutes', '2 minutes', '5 seconds', '3 hours'], a: 0,
            ex: 'ตาปรับตัวในที่มืดเต็มที่ประมาณ 30 นาที และแสงจ้าเพียงครั้งเดียวทำให้ต้องเริ่มใหม่' },
          { type: 'mc', q: 'After a prolonged, gradual turn, levelling the wings can make a pilot feel banked the opposite way. This illusion is called:', o: ['The leans', 'Somatogravic illusion', 'Black hole approach', 'Autokinesis'], a: 0,
            ex: '"The leans" เกิดจากหูชั้นในปรับตัวกับการเลี้ยวช้าๆ ต้องเชื่อเครื่องวัดเสมอ' },
          { type: 'tf', q: 'Strong acceleration on take-off can create a false sensation of pitching nose-up.', a: true,
            ex: 'Somatogravic illusion อาจทำให้นักบินกดหัวลงโดยไม่จำเป็น โดยเฉพาะตอนกลางคืน' }
        ]
      }
    ]
  }
];
