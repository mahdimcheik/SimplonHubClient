import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';
/***
 * Directive qui ajoute un astérisque rouge à côté d'un élément HTML pour indiquer qu'il est requis.
 * Utilisation : <label RequiredAsterisk>Nom</label>
 * Résultat : Nom*
 */
@Directive({
    selector: '[RequiredAsterisk]'
})
export class RequiredAsteriskDirective implements OnInit {
    @Input() appRequiredAsterisk = '';

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) {}

    ngOnInit() {
        const asterisk = this.renderer.createElement('span');
        this.renderer.setProperty(asterisk, 'innerHTML', '*');
        this.renderer.setStyle(asterisk, 'color', 'red');
        this.renderer.appendChild(this.el.nativeElement, asterisk);
    }
}
