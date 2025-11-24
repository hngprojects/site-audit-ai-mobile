export const emojis = ['😀', '😂', '😊', '😍', '🥰', '😘', '😉', '😎', '🤔', '😮', '😢', '😭', '😤', '😡', '🥺', '😴', '🤤', '🤗', '🤐', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😓', '🤭', '🤫', '🤥', '😬', '🙂', '🙃', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isUser: boolean;
}

export const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'Support',
    text: "Hello! I'm Jane, how can I help you today?",
    timestamp: 'Today, 10:25am',
    isUser: false,
  },
  {
    id: '2',
    sender: 'Damian Amadi',
    text: 'Hi, I just ran an audit on my website, but the report says Low Readability Score, can you explain what that means?',
    timestamp: 'Today, 10:35am',
    isUser: true,
  },
  {
    id: '3',
    sender: 'Support',
    text: "Sure, Low Readability Score means that your website text might be too complex or difficult for visitors to read easily. It's often caused by long sentences, jargon, or poor text formatting.",
    timestamp: 'Today, 10:40am',
    isUser: false,
  },
  {
    id: '4',
    sender: 'Damian Amadi',
    text: 'Oh i see,. Can your team fix it?',
    timestamp: 'Today, 11:29am',
    isUser: true,
  },
];