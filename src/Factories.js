const uuidv4 = require('uuid/v4');

/*
 *	createUser
 *	Cria o usuário.
 *	@prop id {string}
 *	@prop name {string}
 *	@param {object}
 *		name {string}
 */
const createUser = ({ name = '' } = {}) => ({
  id: uuidv4(),
  name,
});

/*
 *	createMessage
 *	Cria o corpo da mensagem.
 * 	@prop id {string}
 * 	@prop time {Date} the time in 24hr format i.e. 14:22
 * 	@prop message {string} string da mensagem atual
 * 	@prop sender {string} envio da mensagem
 *	@param {object}
 *		message {string}
 *		sender {string}
 */
const createMessage = ({ message = '', sender = '' } = {}) => ({
  id: uuidv4(),
  time: getTime(new Date(Date.now())),
  message,
  sender,
});

/*
 *	createChat
 *	CCria o chat
 * 	@prop id {string}
 * 	@prop name {string}
 * 	@prop messages {Array.Message}
 * 	@prop users {Array.string}
 *	@param {object}
 *		messages {Array.Message}
 *		name {string}
 *		users {Array.string}
 *
 */
const createChat = ({
  messages = [],
  name = 'Nossa Conversa',
  users = [],
} = {}) => ({
  id: uuidv4(),
  name,
  messages,
  users,
  typingUsers: [],
});

/*
 *	@param date {Date}
 *	@return a string represented in 24hr time i.e. '11:30', '19:30'
 */
const getTime = (date) => {
  return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
};

module.exports = {
  createMessage,
  createChat,
  createUser,
};
