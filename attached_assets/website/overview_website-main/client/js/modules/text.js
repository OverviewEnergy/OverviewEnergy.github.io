import Clipboard from 'clipboard';

class Text {
  constructor() {
    this.reinit();
  }

  reinit() {
    this.copyToClipboard();
    // this.noOrphans();
  }

  noOrphans() {
    $('h1, h2, h3').each((_index , el) => {
      const $el = $(el);
      let text = $el.text();
      text = text.trim();
      const iLast = text.lastIndexOf(' ');
      const stArr = text.split('');
      stArr[iLast] = '&nbsp;';
      $el.html(stArr.join(''));
    });
  }

  copyToClipboard() {
    const $link = $('[data-clipboard-text]');
    $link.click((e) => {
      e.preventDefault();
    });
    const clipboard = new Clipboard('.ClipboardCopy');
    clipboard.on('success', (e) => {
      const originalText = $link.text();
      $link.text('Copied to clipboard');
      setTimeout(() => {
        $link.text(originalText);
      }, 2000);
    });
  }
};

export default Text;
