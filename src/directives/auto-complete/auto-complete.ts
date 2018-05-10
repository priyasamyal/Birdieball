import { Directive ,ElementRef, Renderer } from '@angular/core';

/**
 * Generated class for the AutoCompleteDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[auto-complete]' // Attribute selector
})
export class AutoCompleteDirective {

  constructor(public element: ElementRef, public renderer: Renderer) {
    console.log('Hello AutoCompleteDirective Directive');
  }
  ngOnInit(){}
}
