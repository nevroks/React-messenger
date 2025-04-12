export const extractLinksFromText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" class="link" target="_blank">${url}</a>`);
  };
  