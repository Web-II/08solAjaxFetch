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
		this._answers = new Array();
	}

	get numberOfTrivias() {
		return this._trivias.length;
	}
	get numberOfAnswers() {
		return this._answers.length;
	}
	get trivia() {
		return this._trivias[this.numberOfAnswers];
	}
	get correctAnswers() {
		return this._answers.reduce((result, a) => a ? result + 1 : result, 0);
	}
	addTrivias(dataObjects) {
		this._trivias = dataObjects.map(t => new Trivia(t.category, t.difficulty, t.question, [...t.incorrect_answers, t.correct_answer], t.correct_answer));
	}
	checkAnswer(answer) {
		this._answers.push(this.trivia.isCorrectAnswer(answer));
		return this._answers[this.numberOfAnswers - 1];
	}
	checkEndGame() {
		return this.numberOfTrivias === this.numberOfAnswers;
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
				this.showTrivia(this._triviaGame.trivia);
			})
			.catch(rejectValue => {
				document.getElementById("answer").innerText = `Something went wrong retrieving the quiz data: ${rejectValue}`;
			});
	}

	showTrivia(trivia) {
		const triviaHTML = document.getElementById("trivia");
		triviaHTML.innerHTML = '';
		document.getElementById("question").innerText = `Question: ${this._triviaGame.numberOfAnswers + 1}/${this._triviaGame.numberOfTrivias}`;
		triviaHTML.insertAdjacentHTML('beforeend',
			`<div class="card-content">
				<span>${trivia.category} - Difficulty: ${trivia.difficulty}</span><br>
				<span>${trivia.question}</span>
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
				document.getElementById("answer").innerHTML = `The correct answer is: <span class="bold">${trivia.correctAnswer}</span>`;
				this._triviaGame.checkAnswer(document.querySelector('input[name="group"]:checked').value);
				document.getElementById("correct").innerText = `Correct answers: ${this._triviaGame.correctAnswers}/${this._triviaGame.numberOfAnswers}`;
				if (!this._triviaGame.checkEndGame()) {
					document.getElementById('next').innerText = 'Next question';
					document.getElementById('next').onclick = () => {
						document.getElementById("answer").innerHTML = '';
						this.showTrivia(this._triviaGame.trivia);
					};
				} else {
					document.getElementById('next').className = 'btn-small blue darken-2 disabled';
				};
			}
		}
	}
}

const init = function () {
	new TriviaApp();
}

window.onload = init;