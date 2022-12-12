export default (currentChannelId) => ({ messages }) => messages.messages
  .filter((message) => message.channelId === currentChannelId);
