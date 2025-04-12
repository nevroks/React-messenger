import axios from "axios";

export const fetchEmojis = async () => {
    const response = await axios.get('https://unpkg.com/emoji.json@15.1.0/emoji.json');
    return response.data;
};
