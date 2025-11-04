import gsap from 'gsap';
class PostIndex {
  constructor($section) {
    this.$section = $section;
    this.initFilterButtons();
    this.initPagination();
  }

  initFilterButtons() {
    $('[data-post-filter]', this.$section).on('click', (e) => {
      e.preventDefault();
      const $el = $(e.currentTarget);
      const url = $el.attr('href');
      $('[data-post-filter]', this.$section).attr('aria-current', 'false');
      $el.attr('aria-current', true);
      this.fetch({ url, mode: 'filter' });
    })
  }

  initPagination() {
    $('[data-pagination-more]', this.$section).on('click', (e) => {
      e.preventDefault();
      const $el = $(e.currentTarget);
      let href = $el.attr('href');
      href = href.replace('//localhost', 'http://localhost');
      const url = new URL(href);
      this.fetch({ url: `${url.pathname}${url.search}`, mode: 'pagination' })
    })
  }

  fetch({ url, mode }) {
    $.ajax({
      url,
      method: 'GET',
      contentType: 'application/json',
      success: (response) => {
        if (mode === 'filter') {
          this.replacePosts(response);
        }
        if (mode === 'pagination') {
          this.appendPosts(response);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  appendPosts(response) {
    const $html = $(response);
    const $content = $('[data-post-content] #posts', $html);
    const $pagination = $('[data-post-pagination]', $html);
    $('[data-post-content] #posts', this.$section).append($content.html());
    $('[data-pagination-more]', this.$section).remove();
    $('[data-post-pagination]', this.$section).append($pagination.html());
    this.initPagination();
  }

  replacePosts(response) {
    const fadeSpeed = 100;
    const $html = $(response);
    const $newContent = $('[data-post-content]', $html);
    const $contentContainer = $('[data-post-content]', this.$section);

    $newContent.css({ opacity: 0 });
    gsap.to($contentContainer, {
      opacity: 0,
      duration: fadeSpeed/1000,
      ease: 'none'
    });

    setTimeout(() => {
      const $pagination = $('[data-post-pagination]', $html);
      $('[data-post-content]', this.$section).replaceWith($newContent);
      const $existingPagination = $('[data-post-pagination]', this.$section);
      if ($existingPagination.length > 0) {
        $('[data-post-pagination]', this.$section).replaceWith($pagination);
      } else {
        $(this.$section).append($pagination);
      }
      this.initPagination();
    }, fadeSpeed);

    setTimeout(() => {
      gsap.to($newContent, {
        opacity: 1,
        duration: fadeSpeed/1000,
        ease: 'none'
      });
    }, fadeSpeed * 2);
  }

  kill()  {
    $('[data-post-filter]', this.$section).off();
  }
};

export default PostIndex;
