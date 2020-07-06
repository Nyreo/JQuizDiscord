/* eslint-disable no-undef */
const MessageHandler = require('../messageHandler');

const defaultQuestionData = require('./data/mock_question.json');

describe('Creating question embed', () => {

	let testQuestion, answers;

	beforeAll(() => {
		testQuestion = defaultQuestionData.results[0];

		answers = testQuestion.incorrect_answers;
		answers.push(testQuestion.correct_answer);
	});

	test('Standard input message creation', () => {
		const questionEmbed = MessageHandler.create.questionMessage(1, testQuestion.question, answers);

		expect(questionEmbed.title.toLowerCase()).toEqual('question 1');
		expect(questionEmbed.fields.length).toBe(answers.length);
		expect(questionEmbed.description).toBe(testQuestion.question);
	});

	test('Test invalid number type', () => {
		const createQuestionEmbed = () => MessageHandler.create.questionMessage('test', testQuestion.question, answers);

		expect(createQuestionEmbed).toThrow(TypeError);
	});

	test('Test invalid question type', () => {
		const createQuestionEmbed = () => MessageHandler.create.questionMessage(1, 1, answers);

		expect(createQuestionEmbed).toThrow(TypeError);
	});

	test('Test invalid answers type', () => {
		const createQuestionEmbed = () => MessageHandler.create.questionMessage(1, testQuestion.question, 1);

		expect(createQuestionEmbed).toThrow(TypeError);
	});
});