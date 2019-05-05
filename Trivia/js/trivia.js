function fetchRequest(url) {
	return fetch(url)
		.then(body => body.json()) //retourneert promise object met response
}

class Trivia {
	constructor(category, difficulty, question, answers, correctAnswer) {
		this._category = category;
		this._difficulty = difficulty;
		this._question = question;
		this._answers = answers;
		this._correctAnswer = correctAnswer
	}
	get category() {
		return this._category;
	}
	get difficulty() {
		return this._difficulty;
	}
	get question() {
		return this._question;
	}
	get answers() {
		return this._answers;
	}
	get correctAnswer() {
		return this._correctAnswer;
	}
	isCorrectAnswer(answer) {
		return answer === this._correctAnswer;
	}

}

class TriviaGame {
	constructor() {
		this._trivias = new Array();
		this._currentTrivia = 0;
		this._correctAnswers = 0;
	}

	get correctAnswers() {
		return this._correctAnswers;
	}

	get numberOfTrivias() {
		return this._trivias.length;
	}

	get currentTrivia() {
		return this._currentTrivia;
	}
	addTrivias(dataObjects){
		this._trivias = dataObjects.map(t => new Trivia(t.category, t.difficulty, t.question, [...t.incorrect_answers, t.correct_answer], t.correct_answer));
	}
	getNextTrivia() {
		this._currentTrivia++;
		this._trivias[this.currentTrivia - 1].answers.sort();
		return this._trivias[this.currentTrivia - 1];
	}

	checkAnswer(answer) {
		if (this._trivias[this.currentTrivia - 1].isCorrectAnswer(answer)) {
			this._correctAnswers++;
			return true;
		} else return false;
	}

	checkEndGame() {
		return this.currentTrivia === this.numberOfTrivias;
	}
}

class TriviaApp {
	constructor() {
		this.getData();
	}
	getData() {
		fetchRequest('https://opentdb.com/api.php?amount=10')
			.then(resultValue => {
				this._triviaGame = new TriviaGame();
				this._triviaGame.addTrivias(resultValue.results);
				this.showTrivia(this._triviaGame.getNextTrivia());
			})
			.catch(rejectValue => {
				console.log(rejectValue);
			});
	}

	showTrivia(trivia) {
		const triviaHTML = document.getElementById("trivia");
		triviaHTML.innerHTML = '';
		document.getElementById("number").innerText = `Question: ${this._triviaGame.currentTrivia}/${this._triviaGame.numberOfTrivias}`;
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
			if (document.querySelector('input[name="group"]:checked')) {
				triviaHTML.insertAdjacentHTML('beforeend',
					`<div class="card-action">
						<p>Answer: ${trivia.correctAnswer}</p>
					</div>`
				);
				this._triviaGame.checkAnswer(document.querySelector('input[name="group"]:checked').value);
				document.getElementById("correct").innerText = `Correct answers: ${this._triviaGame.correctAnswers}/${this._triviaGame.currentTrivia}`;
				if (!this._triviaGame.checkEndGame()) {
					document.getElementById('next').innerText = 'Next';
					document.getElementById('next').onclick = () => {
						this.showTrivia(this._triviaGame.getNextTrivia());
					};
				} else {
					document.getElementById('next').className = 'btn-small blue darken-2 disabled';
				};
			}
		}
	}
}

const init = function () {
	const app = new TriviaApp();
}

window.onload = init;