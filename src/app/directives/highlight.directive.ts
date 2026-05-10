import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

/**
 * Highlights occurrences of a search term inside the host element's text.
 *
 * Usage:
 *   <span [appHighlight]="searchTerm">Some text here</span>
 *
 * Angular concept: structural / attribute directive with DOM manipulation.
 * React equivalent: a wrapper component or custom hook that splits text and
 * renders <mark> spans.
 */
@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective implements OnChanges {
  @Input('appHighlight') searchTerm = '';

  private originalText = '';

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.originalText) {
      this.originalText = this.el.nativeElement.textContent ?? '';
    }

    if (changes['searchTerm']) {
      this.applyHighlight();
    }
  }

  private applyHighlight(): void {
    const term = this.searchTerm?.trim();
    if (!term) {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.escapeHtml(this.originalText));
      return;
    }

    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const highlighted = this.escapeHtml(this.originalText).replace(
      regex,
      '<mark class="highlight">$1</mark>'
    );
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', highlighted);
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
