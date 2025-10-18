import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RequiredAsteriskDirective } from './required-asterisk.directive';

// Test component to host the directive
@Component({
    template: `
        <div RequiredAsterisk>Test Element</div>
        <span RequiredAsterisk [appRequiredAsterisk]="customText">Another Element</span>
    `
})
class TestComponent {}

describe('RequiredAsteriskDirective', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let debugElements: DebugElement[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestComponent, RequiredAsteriskDirective]
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        debugElements = fixture.debugElement.queryAll(By.directive(RequiredAsteriskDirective));
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

    it('should apply the directive to elements with RequiredAsterisk selector', () => {
        expect(debugElements.length).toBe(2);
    });

    it('should add a red asterisk span to the host element', () => {
        const firstElement = debugElements[0];
        const spanElement = firstElement.nativeElement.querySelector('span');

        expect(spanElement).toBeTruthy();
        expect(spanElement.innerHTML).toBe('*');
        expect(spanElement.style.color).toBe('red');
    });

    it('should append the asterisk to the host element', () => {
        const firstElement = debugElements[0];
        const hostElement = firstElement.nativeElement;
        const spanElement = hostElement.querySelector('span');

        expect(hostElement.children.length).toBe(1);
        expect(hostElement.lastChild).toBe(spanElement);
    });

    it('should work with different host elements (div and span)', () => {
        const divElement = debugElements[0].nativeElement;
        const spanElement = debugElements[1].nativeElement;

        expect(divElement.tagName.toLowerCase()).toBe('div');
        expect(spanElement.tagName.toLowerCase()).toBe('span');

        expect(divElement.querySelector('span')).toBeTruthy();
        expect(spanElement.querySelector('span')).toBeTruthy();
    });

    it('should preserve the original content of the host element', () => {
        const firstElement = debugElements[0];
        const hostElement = firstElement.nativeElement;

        expect(hostElement.textContent).toContain('Test Element');
        expect(hostElement.textContent).toContain('*');
    });

    it('should create the asterisk span with correct properties', () => {
        const firstElement = debugElements[0];
        const spanElement = firstElement.nativeElement.querySelector('span');

        expect(spanElement.tagName.toLowerCase()).toBe('span');
        expect(spanElement.innerHTML).toBe('*');
        expect(spanElement.style.color).toBe('red');
    });

    it('should handle multiple elements with the directive independently', () => {
        const firstElement = debugElements[0].nativeElement;
        const secondElement = debugElements[1].nativeElement;

        const firstAsterisk = firstElement.querySelector('span');
        const secondAsterisk = secondElement.querySelector('span');

        expect(firstAsterisk).toBeTruthy();
        expect(secondAsterisk).toBeTruthy();
        expect(firstAsterisk).not.toBe(secondAsterisk);
    });

    it('should work with input property appRequiredAsterisk', () => {
        const secondElement = debugElements[1];
        const directive = secondElement.injector.get(RequiredAsteriskDirective);

        // The directive has the input property but doesn't use it in the current implementation
        // This test ensures the directive can be instantiated with the input
        expect(directive.appRequiredAsterisk).toBeDefined();
    });
});
