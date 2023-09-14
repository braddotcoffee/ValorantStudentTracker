import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']
})
export class StudentLandingComponent implements OnInit {
    static readonly MIN_RR_GAINED_VALUE = 10000;
    static readonly MAX_RR_GAINED_VALUE = 500000;
    rrGainedValue: number = 10000;

    async ngOnInit(): Promise<void> {
        this.rrGainedValue = Math.floor(Math.random() * (StudentLandingComponent.MAX_RR_GAINED_VALUE - StudentLandingComponent.MIN_RR_GAINED_VALUE + 1) + StudentLandingComponent.MIN_RR_GAINED_VALUE);
    }
}