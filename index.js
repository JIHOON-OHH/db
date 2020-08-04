//express 모듈로 서버 연결하기 index.js
var express = require('express'); //설치한 express모듈을 express변수에 저장
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); // 1
var app = express(); //express를 실행시켜 app 객체 초기화

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;

db.once('open', function(){
  console.log('DB connected');
});
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

// Other setting
app.set('view engine', 'ejs'); //express의 템플릿 view engine에 ejs 세팅
app.use(express.static(__dirname+'/public')); //현재위치/public 경로를 정적폴더로
app.use(bodyParser.json()); // 2
app.use(bodyParser.urlencoded({extended:true})); // 3

// DB Schema // 4
var contactSchema = mongoose.Schema({
  name:{type:String, required:true, unique:true},
  email:{type:String},
  phone:{type:String}
});
var Contact = mongoose.model('contact', contactSchema); // 5

// Routes
// Home // 6
app.get('/', function(req, res){
  res.redirect('/contacts');
});
// Contacts - Index // 7
app.get('/contacts', function(req, res){
  Contact.find({}, function(err, contacts){
    if(err) return res.json(err);
    res.render('contacts/index', {contacts:contacts});
  });
});
// Contacts - New // 8
app.get('/contacts/new', function(req, res){
  res.render('contacts/new');
});
// Contacts - Create // 9
app.post('/contacts', function(req, res){
  Contact.create(req.body, function(err, contact){
    if(err) return res.json(err);
    res.redirect('/contacts');
  });
});

/*app.get('/hello', function(req,res){ //query를 통해 이름 받는 코드
  res.render('hello', {name:req.query.nameQuery}); //req.query에 저장됨
});

app.get('/hello/:nameParam', function(req, res){ // '/hello/' 위치에 'nameParam'을 요청받으면
  res.render('hello', {name:req.params.nameParam}); //"hello"와 name에 nameParam을 전달
});

//res.render 첫 파라미터로 ejs파일 이름, 두번째 파라미터로 ejs에서 사용될 객체 전달
//res.render는 ejs파일을 무조건 /views폴더에서 찾음
*/

var port = 4000;
app.listen(port, function(){ //4000번 포트에 node.js 서버 연결
  console.log('server on! http://localhost:'+port); //서버 연결시 메시지
});
