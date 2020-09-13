const mongoose = require('mongoose');
const db = require('../models');
require('dotenv').config();

// This file empties the Books collection and inserts the books below
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const sentenceSeed = [{
	"english": "Can you give me the water bottle?",
	"korean": "물병 좀 줄래?"
  },{
	"english": "You are cold.",
	"korean": "너 춥다."
  },{
	"english": "Do you want a piece of cake?",
	"korean": "케이크 한 조각 먹을래?"
  },{
	"english": "This is a book of poetry.",
	"korean": "이 책은 시집이다."
  },{
	"english": "I am tired of working.",
	"korean": "나는 일하는데 지쳤다."
  },{
	"english": "Let's take a moment of silence.",
	"korean": "잠시 침묵을 시간을 가지자."
  },{
	"english": "We just arrived.",
	"korean": "우리는 방금 도착했다."
  },{
	"english": "She went out.",
	"korean": "그녀는 밖으로 나갔다."
  },{
	"english": "Are you cold?",
	"korean": "추우세요?"
  },{
	"english": "I like coffee.",
	"korean": "나는 커피를 좋아한다."
  },{
	"english": "I do this for my parents.",
	"korean": "나는 부모님을 위해 이것을 한다."
  },{
	"english": "Do you like to swim?",
	"korean": "수영 좋아하세요?"
  },{
	"english": "Can you help me?",
	"korean": "좀 도와 줄래요?"
  },{
	"english": "There is talk of peace.",
	"korean": "평화에 대한 상의가 진행 하고 있다."
  },{
	"english": "He is a man of courage.",
	"korean": "그는 용기가 있는 사람이다."
  },{
	"english": "She was my girlfriend.",
	"korean": "그녀는 내 여자친구였다."
  },{
	"english": "I am going to die of hunger.",
	"korean": "배고파 죽겠다."
  },{
	"english": "I'm hot.",
	"korean": "나는 덥다."
  },{
	"english": "Do you want that computer?",
	"korean": "그 컴퓨터를 원하십니까?"
  },{
	"english": "I am just a man.",
	"korean": "나는 그저 사람일 뿐이다."
  },{
	"english": "He grew to 180 centimeters.",
	"korean": "그는 180cm까지 자랐다."
  },{
	"english": "What do you want?",
	"korean": "무슨 일로 그러시죠?"
  },{
	"english": "Oh, hi.",
	"korean": "아, 안녕하세요."
  },{
	"english": "He came with his friend.",
	"korean": "그는 그의 친구와 함께 왔다."
  },{
	"english": "Don't do that.",
	"korean": "그러지 마세요"
  },{
	"english": "It is hot.",
	"korean": "덥다."
  },{
	"english": "She is one of the police.",
	"korean": "그녀는 경찰이다."
  },{
	"english": "What are you doing?",
	"korean": "뭐하고 있어?"
  },{
	"english": "No, I don't want to do this.",
	"korean": "아니, 이걸 하고 싶지 않아."
  },{
	"english": "I will go to the park.",
	"korean": "나는 공원에 갈 것이다."
  },{
	"english": "I can swim well.",
	"korean": "나는 수영을 잘할 수 있다."
  },{
	"english": "This is my phone.",
	"korean": "이건 내 폰이야."
  },{
	"english": "This is a computer.",
	"korean": "이것은 컴퓨터다."
  },{
	"english": "I know him.",
	"korean": "난 그를 알고 있다."
  },{
	"english": "She cut me in line.",
	"korean": "그녀는 내 앞에 끼어 들었다."
  },{
	"english": "Help me!",
	"korean": "도와 주세요"
  },{
	"english": "Don't be mad.",
	"korean": "화내지 마세요."
  },{
	"english": "Do you have my phone?",
	"korean": "내 전화기 가지고 있니?"
  },{
	"english": "This is the city of Seoul.",
	"korean": "이 도시는 서울이다."
  },{
	"english": "Russia is north of China.",
	"korean": "러시아는 중국의 북쪽에 있다."
  },{
	"english": "He is a just man.",
	"korean": "그는 정의로운 사람이다."
  },{
	"english": "I'm on my way!",
	"korean": "내가 가는 길이야!"
  },{
	"english": "It's cold!",
	"korean": "차가워요!"
  },{
	"english": "I'll be right there!",
	"korean": "금방 갈게!"
  },{
	"english": "Give me all your money.",
	"korean": "네 돈을 다 내게 줘."
  },{
	"english": "She is the queen of England.",
	"korean": "그녀는 영국의 여왕이다."
  },{
	"english": "He is a student.",
	"korean": "그는 학생이다."
  },{
	"english": "Pour the water in the cup.",
	"korean": "컵에 물을 부어라."
  },{
	"english": "We just missed the bus.",
	"korean": "우리는 방금 버스를 놓쳤다."
  },{
	"english": "Give it to me.",
	"korean": "그거 내게 줘."
  },{
	"english": "I know her.",
	"korean": "난 그녀를 안다."
  },{
	"english": "Okay.",
	"korean": "알았어요"
  },{
	"english": "I was hot so I took off my jacket.",
	"korean": "나는 더워서 재킷을 벗었다."
  },{
	"english": "Okay, I'll help you.",
	"korean": "알았어, 내가 도와줄게."
  },{
	"english": "Do you have time?",
	"korean": "혹시 시간 있으세요?"
  },{
	"english": "I have a cup of coffee.",
	"korean": "나는 커피 한 잔이 있다."
  },{
	"english": "I am cold.",
	"korean": "나 추워."
  },{
	"english": "I want food and drinks.",
	"korean": "나는 음식과 음료를 원한다."
  },{
	"english": "This is a computer.",
	"korean": "이것은 컴퓨터다."
  },{
	"english": "It was nice of you to buy me food.",
	"korean": "음식을 사줘서 고마워."
  },{
	"english": "Can you put it on the table?",
	"korean": "테이블 위에 올려줄 수 있어?"
  },{
	"english": "Pour the water out.",
	"korean": "물을 부어라."
  },{
	"english": "Do this for me.",
	"korean": "저를 위해 이것을 해 주세요."
  },{
	"english": "There are no people in this café.",
	"korean": "이 카페에는 사람이 없다."
  },{
	"english": "This is your phone.",
	"korean": "이건 네 전화기야."
  },{
	"english": "He's not my friend.",
	"korean": "그는 나의 친구가 아니다."
  },{
	"english": "Your phone is over here.",
	"korean": "네 전화기는 여기 있어."
  },{
	"english": "Can we go to the mall?",
	"korean": "우리 쇼핑몰에 갈 수 있을까?"
  },{
	"english": "I got an A on my test!",
	"korean": "나는 시험에서 A를 받았어!"
  },{
	"english": "There's no one in the restaurant.",
	"korean": "식당에는 아무도 없다."
  },{
	"english": "Do you have some money?",
	"korean": "돈이 있습니까?"
  },{
	"english": "I love you.",
	"korean": "사랑해"
  },{
	"english": "I am gonna go to the park.",
	"korean": "난 공원에 갈 거야."
  },{
	"english": "You're right!",
	"korean": "네 말이 맞아!"
  },{
	"english": "I put your phone over there.",
	"korean": "내가 네 전화기를 저기 놓았어."
  },{
	"english": "I want some coffee.",
	"korean": "나는 커피를 원합니다."
  },{
	"english": "Can you get my phone?",
	"korean": "내 전화 좀 받아줄래?"
  },{
	"english": "I am doing well.",
	"korean": "나는 잘 지내고 있다."
  },{
	"english": "I'm at the café.",
	"korean": "난 카페에 있어."
  },{
	"english": "I am studious.",
	"korean": "나는 학구적이다."
  },{
	"english": "I will be sad if I run out of money.",
	"korean": "돈이 떨어지면 슬퍼질 거야."
  },{
	"english": "This is my right hand.",
	"korean": "이건 내 오른손이야."
  },{
	"english": "Hey, how are you doing?",
	"korean": "안녕, 어떻게 지내니?"
  },{
	"english": "What do you mean?",
	"korean": "그게 무슨 말이죠?"
  },{
	"english": "I don't get it.",
	"korean": "이해가 잘 안 돼요."
  },{
	"english": "That's my favorite scene in the movie.",
	"korean": "그 장면은 내가 그 영화에서 가장 좋아하는 장면이다."
  },{
	"english": "I live here.",
	"korean": "나는 여기 산다."
  },{
	"english": "I want some coffee, but I have no money.",
	"korean": "나는 커피를 마시고 싶지만 돈이 없다."
  },{
	"english": "This guy is cool.",
	"korean": "이 사람은 멋지다."
  },{
	"english": "Look over there.",
	"korean": "저기봐요"
  },{
	"english": "I want to eat lunch.",
	"korean": "나는 점심을 먹고 싶다."
  },{
	"english": "You are mean.",
	"korean": "너무하세요."
  },{
	"english": "I am about 6 feet tall.",
	"korean": "나는 키가 182 cm 정도 된다."
  },{
	"english": "We are friends.",
	"korean": "우린 친구야."
  },{
	"english": "She is my friend.",
	"korean": "그녀는 나의 친구다."
  },{
	"english": "I am your friend.",
	"korean": "나는 너의 친구다."
  },{
	"english": "I put it right there.",
	"korean": "내가 바로 거기에 뒀어."
  },{
	"english": "How did you do that?",
	"korean": "어떻게 해서 말입니까?"
  },{
	"english": "That's not a dog.",
	"korean": "그건 개가 아니야."
  },{
	"english": "I think I am smart.",
	"korean": "나는 내가 똑똑하다고 생각한다."
  },{
	"english": "Y'know that I'm going to drink that coffee, right?",
	"korean": "내가 그 커피 마실거 알지?"
  },{
	"english": "I am not a student.",
	"korean": "나는 학생이 아니다."
  },{
	"english": "Let's go to a café.",
	"korean": "카페에 가자."
  },{
	"english": "I am really hungry.",
	"korean": "나는 정말 배가 고프다."
  },{
	"english": "Is your back okay?",
	"korean": "등 괜찮니?"
  },{
	"english": "Will you buy me lunch if I help you?",
	"korean": "내가 도와준다면 점심 사줄래?"
  },{
	"english": "Yeah, you're right.",
	"korean": "네, 당신이 맞아요."
  },{
	"english": "What are you talking about?",
	"korean": "무슨 말씀 하시는 거예요?"
  },{
	"english": "Let's get some food.",
	"korean": "뭐 좀 먹자."
  },{
	"english": "He is smart.",
	"korean": "그는 똑똑하다."
  },{
	"english": "They are smart.",
	"korean": "그들은 똑똑하다."
  },{
	"english": "would you like coffee or tea?",
	"korean": "커피로 하시겠습니까, 차를 드시겠습니까?"
  },{
	"english": "I believe in god.",
	"korean": "저는 하느님이 계신다고 믿어요."
  },{
	"english": "I'm back!",
	"korean": "제가 다시 왔습니다!"
  },{
	"english": "I am right.",
	"korean": "내가 옳다."
  },{
	"english": "Your backpack is down there.",
	"korean": "네 가방은 저 아래에 있어."
  },{
	"english": "What are you doing now?",
	"korean": "지금 무엇을 하고 계세요?"
  },{
	"english": "Hi!",
	"korean": "안녕!"
  },{
	"english": "I'll help you.",
	"korean": "제가 도와 드릴게요."
  }]

db.Sentences.deleteMany({})
	.then(() => db.Sentences.collection.insertMany(sentenceSeed))
	.then((data) => {
		console.log(data.result.n + ' records inserted!');
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
