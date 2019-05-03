function fetchRequest(url){
	return fetch(url)
  		.then(body => body.json()) //retourneert promise object met response
}
class Trivia {
	constructor(category, difficulty, question, answers, correctAnswer) {
		this.category = category;
		this.difficulty = difficulty;
		this.question = question;
		this.answers = answers;
		this.correctAnswer = correctAnswer
	}
	get category() {
		return this._category;
	}
	set category(value) {
		this._category = value;
	}
	get difficulty() {
		return this._difficulty;
	}
	set difficulty(value) {
		this._difficulty = value;
	}
	set question(value) {
		this._question = value;
	}
	get question() {
		return this._question;
	}
	set answers(value) {
		this._answers = value;
	}
	get answers() {
		return this._answers;
	}
	set correctAnswer(value) {
		this._correctAnswer = value;
	}
	get correctAnswer() {
		return this._correctAnswer;
	}
	
}
class TriviaRepository {
  	constructor() {
    	this._triviaObjects = [];
		this.currentTrivia = 0;
		this.correctAnswers = 0;
  	}

  	get triviaObjects() { return this._triviaObjects; }
	get currentTrivia() {
		return this._currentTrivia;
	}
	set currentTrivia(value) {
		this._currentTrivia = value;
	}
	get correctAnswers() {
		return this._correctAnswers;
	}
	set correctAnswers(value) {
		this._correctAnswers = value;
	}
	get numberOfTrivias(){
		return this._triviaObjects.length;
	}

  	addTriviaObjects(dataObjects) {
		  this._triviaObjects = 
		         dataObjects.map(t=>new Trivia(t.category,t.difficulty,t.question,[...t.incorrect_answers,t.correct_answer],t.correct_answer));
  	}

  	getNextTrivia(){
		this.currentTrivia++;
		this.triviaObjects[this.currentTrivia-1].answers.sort();
		return this.triviaObjects[this.currentTrivia-1];
	}
	
	checkAnswer(answer){
		if (this.triviaObjects[this.currentTrivia-1].correctAnswer === answer){
			this.correctAnswers++;
			return true;
		}
		else return false;
	}
	checkEndGame(){
		return this.currentTrivia === this.numberOfTrivias;
	} 
}
class TriviaApp {
	constructor() {
		this.triviaRepository = new TriviaRepository();		
		this.getData();		
	}
	get triviaRepository() {
		return this._triviaRepository;
	}
	set triviaRepository(value) {
		this._triviaRepository = value;
	}
	
	getData(){
		fetchRequest('https://opentdb.com/api.php?amount=10')
  		.then(resultValue => {
			this.triviaRepository.addTriviaObjects(resultValue.results);
			this.showTrivia(this.triviaRepository.getNextTrivia());
		})
		.catch(rejectValue => { console.log(rejectValue); });
	}
	showTrivia(trivia){
		const triviaHTML = document.getElementById("trivia");
		triviaHTML.innerHTML = '';
		document.getElementById("number").innerText= `Question: ${this.triviaRepository.currentTrivia}/${this.triviaRepository.numberOfTrivias}`;
		triviaHTML.insertAdjacentHTML('beforeend',
			`<div class="card-content">
				<span class="card-title">${trivia.category} - Difficulty: ${trivia.difficulty}</span>
				<p>${trivia.question}</p>
			</div>`
		);
		const divCA = document.createElement('div');
		divCA.className = 'card-action';
		const divRow = document.createElement('div');
		divRow.className = 'row';
		trivia.answers.forEach((a) => {
			divRow.insertAdjacentHTML('beforeend',
				`<div class="col s12 m6">
					<p>
						<label>
							<input class="with-gap" name="group" value="${a}" type="radio" />
							<span>${a}</span>
						</label>
					</p>
				</div>
				`
			)
		});
		divCA.appendChild(divRow);
		triviaHTML.appendChild(divCA);	
			triviaHTML.insertAdjacentHTML('beforeend',
				`<div class="card-action">
					<a id="next" class="btn-small blue darken-2">Submit answer<i class="material-icons right">send</i></a>
				</div>`		
			)
			document.getElementById('next').onclick = () => {
				triviaHTML.insertAdjacentHTML('beforeend',
					`<div class="card-action">
						<p>Answer: ${trivia.correctAnswer}</p>
					</div>`		
				);
			this.triviaRepository.checkAnswer(document.querySelector('input[name="group"]:checked').value);
			document.getElementById("correct").innerText= `Correct answers: ${this.triviaRepository.correctAnswers}/${this.triviaRepository.currentTrivia}`;
			if (!this._triviaRepository.checkEndGame()){
				document.getElementById('next').innerText = 'Next';
				document.getElementById('next').onclick = ()=>{
					this.showTrivia(this.triviaRepository.getNextTrivia());
				};
			}
			else{
				document.getElementById('next').className = 'btn-small blue darken-2 disabled';
			};
		}
	}
}

const init = function(){
	const app = new TriviaApp();
}

window.onload = init;