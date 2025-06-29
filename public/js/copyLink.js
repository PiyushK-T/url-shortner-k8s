document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copyBtn');
  const shortUrlLink = document.getElementById('shortUrlLink');

  if (copyBtn && shortUrlLink) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(shortUrlLink.href)
        .then(() => {
          copyBtn.textContent = 'COPIED!';
          setTimeout(() => { copyBtn.textContent = 'COPY LINK'; }, 2000);
        })
        .catch(() => alert('Failed to copy URL'));
    });
  }
});
