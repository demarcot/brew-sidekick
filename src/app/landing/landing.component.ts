import { Component, OnInit } from "@angular/core";
import { Form, FormControl, FormGroup } from '@angular/forms';


@Component({
    selector: "app-landing",
    templateUrl: "./landing.component.html",
    styleUrls: ["./landing.component.css"]
})
export class LandingComponent implements OnInit {
    
    // Pre Brew Calculations
    // - Strike Temp
    // - Strike Vol
    // - Abs Vol
    // - First Runnings Vol
    // - Sparge Vol
    // - Est Pre Boil Grav
    // - Pre Boil Vol
    public targetMashTemp = new FormControl(152);
    public grainWeight = new FormControl(10);
    public absRate = new FormControl(0.125);
    public evapRate = new FormControl(0.5);
    public mashTunLoss = new FormControl(.21);
    public targetOg = new FormControl(1.060);
    public batchVol = new FormControl(5);

    
    public mashThickness: number; // .3125gal/lb
    public grainTemp: number;
    public strikeTemp: number; //(.2/(4*mashThickness))(targetMashTemp - grainTemp) + targetMashTemp
    public strikeVol: number; // grainWeight*mashThickness
    public absVol: number; // grainWeight * absRate
    public preboilVol: number; // batchVol + evapRate * boilHrs
    public firstRunningsVol: number; // strikeVol - (absVol + mashTunLoss)
    public spargeVol: number; // preboilVol - firstRunningsVol
    public estPreboilGrav: number; // (targetOg*targetVol)/preboilVol

    // Brew Corrections
    // - Raise Pre Boil Grav
    // - Lower Pre Boil Grav
    public collectedPreboilVol = new FormControl(6);
    public measuredGrav = new FormControl(1.059);
    public targetGrav = new FormControl(1.060);
    // Weight of addition = (Volume of wort * (Target gravity – Measured gravity)) / Extract potential points of addition
    // Light DME Potential Extract: 1.045
    public dmeAdd: number;
    // Increase (or decrease) in boiling time in minutes = (Pre-boil volume * (Target pre-boil gravity points – Actual pre-boil gravity points) * 60) / (Target pre-boil gravity points * Boiling losses per hour)
    public extraBoilMins: number;

    // Volume Measuring
    // Assuming holding pot and standing on scale
    // 8.32lbs/gal = 1kg/L
    // vol = (currWeight-emptyWeight)/(8.32*specificGrav)
    public currWeight = new FormControl();
    public emptyWeight = new FormControl();
    public specificGrav = new FormControl();
    public currVol: number;

    // Post Brew Calculations
    // - Efficiency
    // - ABV
    public potentialGrav = new FormControl(1.084);
    public measuredOG = new FormControl(1.059);
    public measuredFG = new FormControl(1.060);
    public efficiency: number;
    public abv: number;



    public fg: FormGroup = new FormGroup({
        targetOg: this.targetOg,
        batchVol: this.batchVol,
        targetMashTemp: this.targetMashTemp,
        grainWeight: this.grainWeight,
        absRate: this.absRate,
        mashTunLoss: this.mashTunLoss,
        evapRate: this.evapRate,

        collectedPreboilVol: this.collectedPreboilVol,
        measuredGrav: this.measuredGrav,
        targetGrav: this.targetGrav,

        currWeight: this.currWeight,
        emptyWeight: this.emptyWeight,
        specificGrav: this.specificGrav,

        potentialGrav: this.potentialGrav,
        measuredOG: this.measuredOG,
        measuredFG: this.measuredFG
    });

    constructor(){
    }

    
    ngOnInit(): void {
        this.fg.valueChanges.subscribe(val => {
            this.updateCalculations();
        });

        this.updateCalculations();
    }

    public updateCalculations(): void {
        this.mashThickness = .3125;
        this.grainTemp = 68;
        this.strikeTemp = (.2/(4*this.mashThickness)) * (this.targetMashTemp.value - this.grainTemp) + this.targetMashTemp.value;
        this.strikeVol = this.grainWeight.value * this.mashThickness;
        this.absVol = this.grainWeight.value * this.absRate.value;
        this.preboilVol = 0+this.batchVol.value + 1*this.evapRate.value;
        this.firstRunningsVol = this.strikeVol - (this.absVol + this.mashTunLoss.value);
        this.spargeVol = this.preboilVol - this.firstRunningsVol;
        let targetSG = (this.targetOg.value-1)*1000;
        let preboilSG = (targetSG*this.batchVol.value)/this.preboilVol;
        this.estPreboilGrav = (preboilSG/1000.0)+1.0;

        this.dmeAdd = 5;
        this.extraBoilMins = 5;

        this.currVol = (this.currWeight.value - this.emptyWeight.value)/(8.32 * this.specificGrav.value);

        this.efficiency = (1.0-this.measuredOG.value)/(1.0-this.potentialGrav.value);
        this.abv = 0.1;
    }

    public isGT(a: any, b: any): boolean {
        return a > b;
    }

    public isLT(a: any, b: any): boolean {
        return a < b;
    }
}