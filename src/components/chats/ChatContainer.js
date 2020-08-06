import React, { Component } from 'react';
import SideBar from './SideBar';
import {
  GYRA_CHAT,
  MESSAGE_SENT,
  MESSAGE_RECIEVED,
  TYPING,
} from '../../Events';
import ChatHeading from './ChatHeading';
import Messages from '../messages/Messages';
import MessageInput from '../messages/MessageInput';

export default class ChatContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [],
      activeChat: null,
    };
  }

  componentDidMount() {
    const { socket } = this.props;
    socket.emit(GYRA_CHAT, this.resetChat);
  }

  /*
   *	Reset 
   * 	@param chat {Chat}
   */
  resetChat = (chat) => {
    return this.addChat(chat, true);
  };

  /*
   *	Adicionar chat ao container.
   *
   *	@param chat {Chat} Chat para ser adicionado.
   *	@param reset {boolean} Se o valor for verdadeiro, será o unico chat.
   */
  addChat = (chat, reset) => {
    const { socket } = this.props;
    const { chats } = this.state;

    const newChats = reset ? [chat] : [...chats, chat];
    this.setState({
      chats: newChats,
      activeChat: reset ? chat : this.state.activeChat,
    });

    const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`;
    const typingEvent = `${TYPING}-${chat.id}`;

    socket.on(typingEvent, this.updateTypingInChat(chat.id));
    socket.on(messageEvent, this.addMessageToChat(chat.id));
  };

  /*
   * 	Retorna a função que irá adicionar mensagens ao chat
   *
   * 	@param chatId {number}
   */
  addMessageToChat = (chatId) => {
    return (message) => {
      const { chats } = this.state;
      let newChats = chats.map((chat) => {
        if (chat.id === chatId) chat.messages.push(message);
        return chat;
      });

      this.setState({ chats: newChats });
    };
  };

  /*
   *	Atualização********.
   *	@param chatId {number}
   */
  updateTypingInChat = (chatId) => {
    return ({ isTyping, user }) => {
      if (user !== this.props.user.name) {
        const { chats } = this.state;

        let newChats = chats.map((chat) => {
          if (chat.id === chatId) {
            if (isTyping && !chat.typingUsers.includes(user)) {
              chat.typingUsers.push(user);
            } else if (!isTyping && chat.typingUsers.includes(user)) {
              chat.typingUsers = chat.typingUsers.filter((u) => u !== user);
            }
          }
          return chat;
        });
        this.setState({ chats: newChats });
      }
    };
  };

  /*
   *	Aiciona mensagem ao chat
   *	@param chatId {number}  Id do chat a ser adicionado.
   *	@param message {string} A mensagem a ser adicionada no chat.
   */
  sendMessage = (chatId, message) => {
    const { socket } = this.props;
    socket.emit(MESSAGE_SENT, { chatId, message });
  };

  /*
   *	Envia o status ao server.
   *	chatId {number} O Id do chat que está sendo usado.
   *	typing {boolean} Se o usuário continua digitando ou não.
   */
  sendTyping = (chatId, isTyping) => {
    const { socket } = this.props;
    socket.emit(TYPING, { chatId, isTyping });
  };

  setActiveChat = (activeChat) => {
    this.setState({ activeChat });
  };
  render() {
    const { user, logout } = this.props;
    const { chats, activeChat } = this.state;
    return (
      <div className="container">
        <SideBar
          logout={logout}
          chats={chats}
          user={user}
          activeChat={activeChat}
          setActiveChat={this.setActiveChat}
        />
        <div className="chat-room-container">
          {activeChat !== null ? (
            <div className="chat-room">
              <ChatHeading name={activeChat.name} />
              <Messages
                messages={activeChat.messages}
                user={user}
                typingUsers={activeChat.typingUsers}
              />
              <MessageInput
                sendMessage={(message) => {
                  this.sendMessage(activeChat.id, message);
                }}
                sendTyping={(isTyping) => {
                  this.sendTyping(activeChat.id, isTyping);
                }}
              />
            </div>
          ) : (
            <div className="chat-room choose">
              <h3>Choose a chat!</h3>
            </div>
          )}
        </div>
      </div>
    );
  }
}
