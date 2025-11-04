import Accordion from "./accordion";
import PostIndex from "./postIndex";
import Tooltips from "./tooltips";
import AnimationSlides from "./animationSlides";
import PostPreviews from "./postPreviews";
import Reveal from "./reveal";
class PageSections {
  constructor() {
    this.sections = [];
    this.initModules();
    this.initSections();
  }

  initModules() {
    this.modules = [];
    this.modules["Accordion"] = Accordion;
    this.modules["PostIndex"] = PostIndex;
    this.modules["Tooltips"] = Tooltips;
    this.modules["AnimationSlides"] = AnimationSlides;
    this.modules["PostPreviews"] = PostPreviews;
    this.modules["Reveal"] = Reveal;
  }

  initSections() {
    const $sections = $("[data-init-section]");
    $sections.each((_index, el) => {
      const $section = $(el);
      this.initSection($section);
    });
  }

  initSection($section) {
    const moduleKeys = $section.attr("data-init-section").split(",");
    moduleKeys.forEach((key) => {
      if (typeof this.modules[key] === "function") {
        const section = new this.modules[key]($section);
        this.sections.push(section);
      }
    });
  }

  killSections() {
    this.sections.forEach((section) => {
      if (typeof section.kill === "function") {
        section.kill();
      }
    });
    this.sections = [];
  }
}

export default PageSections;
