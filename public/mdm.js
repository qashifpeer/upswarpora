function setTwoNumberDecimal(event) {
    this.value = parseFloat(this.value).toFixed(2);
}

const btn = document.getElementById("btn").addEventListener("click", () => {

    // *************************************************
    // *************** EXPENSE RATES ******************
    //************************************************ */
    let ratePrimary = 4.97;
    let rateMiddle = 7.45;



    // *******************************************************
    //*********** INPUT FETCH *******************
    //**************************************************** */

    let school = document.getElementById("school").value;
    let month = document.getElementById("month").value;
    let year = document.getElementById("year").value;

    let meals_p1 = document.getElementById("meals-pr-d1").value;
    let meals_m1 = document.getElementById("meals-md-d1").value;

    let meals_p2 = document.getElementById("meals-pr-d2").value;
    let meals_m2 = document.getElementById("meals-md-d2").value;

    let meals_p3 = document.getElementById("meals-pr-d3").value;
    let meals_m3 = document.getElementById("meals-md-d3").value;

    let meals_p4 = document.getElementById("meals-pr-d4").value;
    let meals_m4 = document.getElementById("meals-md-d4").value;

    let meals_p5 = document.getElementById("meals-pr-d5").value;
    let meals_m5 = document.getElementById("meals-md-d5").value;

    let meals_p6 = document.getElementById("meals-pr-d6").value;
    let meals_m6 = document.getElementById("meals-md-d6").value;

    let meals_p7 = document.getElementById("meals-pr-d7").value;
    let meals_m7 = document.getElementById("meals-md-d7").value;

    let meals_p8 = document.getElementById("meals-pr-d8").value;
    let meals_m8 = document.getElementById("meals-md-d8").value;

    let meals_p9 = document.getElementById("meals-pr-d9").value;
    let meals_m9 = document.getElementById("meals-md-d9").value;

    let meals_p10 = document.getElementById("meals-pr-d10").value;
    let meals_m10 = document.getElementById("meals-md-d10").value;

    let meals_p11 = document.getElementById("meals-pr-d11").value;
    let meals_m11 = document.getElementById("meals-md-d11").value;

    let meals_p12 = document.getElementById("meals-pr-d12").value;
    let meals_m12 = document.getElementById("meals-md-d12").value;

    let meals_p13 = document.getElementById("meals-pr-d13").value;
    let meals_m13 = document.getElementById("meals-md-d13").value;

    let meals_p14 = document.getElementById("meals-pr-d14").value;
    let meals_m14 = document.getElementById("meals-md-d14").value;

    let meals_p15 = document.getElementById("meals-pr-d15").value;
    let meals_m15 = document.getElementById("meals-md-d15").value;

    let meals_p16 = document.getElementById("meals-pr-d16").value;
    let meals_m16 = document.getElementById("meals-md-d16").value;

    let meals_p17 = document.getElementById("meals-pr-d17").value;
    let meals_m17 = document.getElementById("meals-md-d17").value;

    let meals_p18 = document.getElementById("meals-pr-d18").value;
    let meals_m18 = document.getElementById("meals-md-d18").value;

    let meals_p19 = document.getElementById("meals-pr-d19").value;
    let meals_m19 = document.getElementById("meals-md-d19").value;

    let meals_p20 = document.getElementById("meals-pr-d20").value;
    let meals_m20 = document.getElementById("meals-md-d20").value;

    let meals_p21 = document.getElementById("meals-pr-d21").value;
    let meals_m21 = document.getElementById("meals-md-d21").value;

    let meals_p22 = document.getElementById("meals-pr-d22").value;
    let meals_m22 = document.getElementById("meals-md-d22").value;

    let meals_p23 = document.getElementById("meals-pr-d23").value;
    let meals_m23 = document.getElementById("meals-md-d23").value;

    let meals_p24 = document.getElementById("meals-pr-d24").value;
    let meals_m24 = document.getElementById("meals-md-d24").value;

    let meals_p25 = document.getElementById("meals-pr-d25").value;
    let meals_m25 = document.getElementById("meals-md-d25").value;

    let meals_p26 = document.getElementById("meals-pr-d26").value;
    let meals_m26 = document.getElementById("meals-md-d26").value;

    let meals_p27 = document.getElementById("meals-pr-d27").value;
    let meals_m27 = document.getElementById("meals-md-d27").value;

    let meals_p28 = document.getElementById("meals-pr-d28").value;
    let meals_m28 = document.getElementById("meals-md-d28").value;

    let meals_p29 = document.getElementById("meals-pr-d29").value;
    let meals_m29 = document.getElementById("meals-md-d29").value;

    let meals_p30 = document.getElementById("meals-pr-d30").value;
    let meals_m30 = document.getElementById("meals-md-d30").value;

    let meals_p31 = document.getElementById("meals-pr-d31").value;
    let meals_m31 = document.getElementById("meals-md-d31").value;

    //**************RICE DETAILS *****************************
    //************************************************** */ */

    let pr_total_meals = +(meals_p1) + +(meals_p2) + +(meals_p3) + +(meals_p4) +
                        +(meals_p5) + +(meals_p6) + +(meals_p7) + +(meals_p8) + +(meals_p9) +
                        +(meals_p10) + +(meals_p11) + +(meals_p12) + +(meals_p13) + +(meals_p14) +
                        +(meals_p15) + +(meals_p16) + +(meals_p17) + +(meals_p18) + +(meals_p19) +
                        +(meals_p20) + +(meals_p21) + +(meals_p22) + +(meals_p23) + +(meals_p24) +
                        +(meals_p25) + +(meals_p26) + +(meals_p27) + +(meals_p28) + +(meals_p29) +
                        +(meals_p30) + +(meals_p31)

    let md_total_meals = +(meals_m1) +  +(meals_m2) + +(meals_m3) +   +(meals_m4) + +(meals_m5) +
                         +(meals_m6) +  +(meals_m7) + +(meals_m8) +   +(meals_m9) + +(meals_m10) +  +(meals_m11) +
                         +(meals_m12) + +(meals_m13) + +(meals_m14) + +(meals_m15) + +(meals_m16) + +(meals_m17) +
                         +(meals_m18) + +(meals_m19) + +(meals_m20) + +(meals_m21) + +(meals_m22) + +(meals_m23) +
                         +(meals_m24) + +(meals_m25) + +(meals_m26) + +(meals_m27) + +(meals_m28) + +(meals_m29) +
                         +(meals_m30) + +(meals_m31)

     // Rice Brought Forward ************
        let pr_rice_lb = document.getElementById("pr_rice_lb").value;
        let md_rice_lb = document.getElementById("md_rice_lb").value;
        localStorage.setItem("pr_rice_lb",pr_rice_lb);
        localStorage.setItem("md_rice_lb",md_rice_lb);


    //**********************RICE LIFTED*/

        let pr_rice_lifted = document.getElementById("pr_rice_lifted").value;
        let md_rice_lifted = document.getElementById("md_rice_lifted").value;
        localStorage.setItem("pr_rice_lifted",pr_rice_lifted);
        localStorage.setItem("md_rice_lifted",md_rice_lifted);


    //Total Rice Consumed
        let pr_rice_consumed = ((pr_total_meals * 100)/1000).toFixed(3)
        let md_rice_consumed = ((pr_total_meals * 150)/1000).toFixed(3)
        localStorage.setItem("pr_rice_consumed", pr_rice_consumed)
        localStorage.setItem("md_rice_consumed", md_rice_consumed)

    //RICE BALANCE

        let pr_rice_balance = (parseFloat(pr_rice_lb) + parseFloat(pr_rice_lifted)) - parseFloat(pr_rice_consumed)
        let md_rice_balance = (parseFloat(md_rice_lb) + parseFloat(md_rice_lifted)) - parseFloat(md_rice_consumed)
        localStorage.setItem("pr_rice_balance", pr_rice_balance)
        localStorage.setItem("md_rice_balance", md_rice_balance)

        //  localStorage.setItem("pr_rice_balance", pr_rice_balance)
        //  localStorage.setItem("md_rice_balance", md_rice_balance)









    let pr_bf = document.getElementById("pr_bf").value;
    let md_bf = document.getElementById("md_bf").value;
    let pr_income = document.getElementById("pr_income").value;
    let md_income = document.getElementById("md_income").value;




    // **********************************************************
    //************* CALCULATE EXPENDITURE Primary **********
    //******************************************************** */
    let exp_p1 = ((meals_p1*ratePrimary));
    let exp_p2 = ((meals_p2*ratePrimary));
    let exp_p3 = ((meals_p3*ratePrimary));
    let exp_p4 = ((meals_p4*ratePrimary));
    let exp_p5 = ((meals_p5*ratePrimary));
    let exp_p6 = ((meals_p6*ratePrimary));
    let exp_p7 = ((meals_p7*ratePrimary));
    let exp_p8 = ((meals_p8*ratePrimary));
    let exp_p9 = ((meals_p9*ratePrimary));
    let exp_p10 = ((meals_p10*ratePrimary));
    let exp_p11 = ((meals_p11*ratePrimary));
    let exp_p12 = ((meals_p12*ratePrimary));
    let exp_p13 = ((meals_p13*ratePrimary));
    let exp_p14 = ((meals_p14*ratePrimary));
    let exp_p15 = ((meals_p15*ratePrimary));
    let exp_p16 = ((meals_p16*ratePrimary));
    let exp_p17 = ((meals_p17*ratePrimary));
    let exp_p18 = ((meals_p18*ratePrimary));
    let exp_p19 = ((meals_p19*ratePrimary));
    let exp_p20 = ((meals_p20*ratePrimary));
    let exp_p21 = ((meals_p21*ratePrimary));
    let exp_p22 = ((meals_p22*ratePrimary));
    let exp_p23 = ((meals_p23*ratePrimary));
    let exp_p24 = ((meals_p24*ratePrimary));
    let exp_p25 = ((meals_p25*ratePrimary));
    let exp_p26 = ((meals_p26*ratePrimary));
    let exp_p27 = ((meals_p27*ratePrimary));
    let exp_p28 = ((meals_p28*ratePrimary));
    let exp_p29 = ((meals_p29*ratePrimary));
    let exp_p30 = ((meals_p30*ratePrimary));
    let exp_p31 = ((meals_p31*ratePrimary));

    // **********************************************************
    //************* CALCULATE EXPENDITURE Middle **********
    //******************************************************** */

    let exp_md1 = (meals_m1*rateMiddle);
    let exp_md2 = (meals_m2*rateMiddle);
    let exp_md3 = (meals_m3*rateMiddle);
    let exp_md4 = (meals_m4*rateMiddle);
    let exp_md5 = (meals_m5*rateMiddle);
    let exp_md6 = (meals_m6*rateMiddle);
    let exp_md7 = (meals_m7*rateMiddle);
    let exp_md8 = (meals_m8*rateMiddle);
    let exp_md9 = (meals_m9*rateMiddle);
    let exp_md10 = (meals_m10*rateMiddle);
    let exp_md11 = (meals_m11*rateMiddle);
    let exp_md12 = (meals_m12*rateMiddle);
    let exp_md13 = (meals_m13*rateMiddle);
    let exp_md14 = (meals_m14*rateMiddle);
    let exp_md15 = (meals_m15*rateMiddle);
    let exp_md16 = (meals_m16*rateMiddle);
    let exp_md17 = (meals_m17*rateMiddle);
    let exp_md18 = (meals_m18*rateMiddle);
    let exp_md19 = (meals_m19*rateMiddle);
    let exp_md20 = (meals_m20*rateMiddle);
    let exp_md21 = (meals_m21*rateMiddle);
    let exp_md22 = (meals_m22*rateMiddle);
    let exp_md23 = (meals_m23*rateMiddle);
    let exp_md24 = (meals_m24*rateMiddle);
    let exp_md25 = (meals_m25*rateMiddle);
    let exp_md26 = (meals_m26*rateMiddle);
    let exp_md27 = (meals_m27*rateMiddle);
    let exp_md28 = (meals_m28*rateMiddle);
    let exp_md29 = (meals_m29*rateMiddle);
    let exp_md30 = (meals_m30*rateMiddle)
    let exp_md31 = (meals_m31*rateMiddle);


    // **********************************************************
    //************* CALCULATE EXPENDITURE TOTAL DAY WISE  **********
    //******************************************************** */
    let exp_d1 = ((exp_p1)  + (exp_md1)).toFixed(2);
    let exp_d2 = ((exp_p2) + (exp_md2)).toFixed(2);
    let exp_d3 = ((exp_p3) + (exp_md3)).toFixed(2);
    let exp_d4 = ((exp_p4) + (exp_md4)).toFixed(2);
    let exp_d5 = ((exp_p5) + (exp_md5)).toFixed(2);
    let exp_d6 = ((exp_p6) + (exp_md6)).toFixed(2);
    let exp_d7 = ((exp_p7) + (exp_md7)).toFixed(2);
    let exp_d8 = ((exp_p8) + (exp_md8)).toFixed(2);
    let exp_d9 = ((exp_p9) + (exp_md9)).toFixed(2);
    let exp_d10 = ((exp_p10) + (exp_md10)).toFixed(2);
    let exp_d11 = ((exp_p11) + (exp_md11)).toFixed(2);
    let exp_d12 = ((exp_p12) + (exp_md12)).toFixed(2);
    let exp_d13 = ((exp_p13) + (exp_md13)).toFixed(2);
    let exp_d14 = ((exp_p14) + (exp_md14)).toFixed(2);
    let exp_d15 = ((exp_p15) + (exp_md15)).toFixed(2);
    let exp_d16 = ((exp_p16) + (exp_md16)).toFixed(2);
    let exp_d17 = ((exp_p17) + (exp_md17)).toFixed(2);
    let exp_d18 = ((exp_p18) + (exp_md18)).toFixed(2);
    let exp_d19 = ((exp_p19) + (exp_md19)).toFixed(2);
    let exp_d20 = ((exp_p20) + (exp_md20)).toFixed(2);
    let exp_d21 = ((exp_p21) + (exp_md21)).toFixed(2);
    let exp_d22 = ((exp_p22) + (exp_md22)).toFixed(2);
    let exp_d23 = ((exp_p23) + (exp_md23)).toFixed(2);
    let exp_d24 = ((exp_p24) + (exp_md24)).toFixed(2);
    let exp_d25 = ((exp_p25) + (exp_md25)).toFixed(2);
    let exp_d26 = ((exp_p26) + (exp_md26)).toFixed(2);
    let exp_d27 = ((exp_p27) + (exp_md27)).toFixed(2);
    let exp_d28 = ((exp_p28) + (exp_md28)).toFixed(2);
    let exp_d29 = ((exp_p29) + (exp_md29)).toFixed(2);
    let exp_d30 = ((exp_p30) + (exp_md30)).toFixed(2);
    let exp_d31 = ((exp_p31) + (exp_md31)).toFixed(2);

    // **********************************************************
    //************* CALCULATE EXPENDITURE TOTAL   **********
    //******************************************************** */

    total_exp_pr =     ((exp_p1) + (exp_p2) + (exp_p3) + (exp_p4)
                    + (exp_p5) + (exp_p6) + (exp_p7) + (exp_p8) + (exp_p9)
                    + (exp_p10) + (exp_p11) + (exp_p12) + (exp_p13) + (exp_p14)
                    + (exp_p15) + (exp_p16) + (exp_p17) + (exp_p18) + (exp_p19)
                    + (exp_p20) + (exp_p21) + (exp_p22) + (exp_p23) + (exp_p24)
                    + (exp_p25) + (exp_p26) + (exp_p27) + (exp_p28) + (exp_p29)
                    + (exp_p30) + (exp_p31)).toFixed(2)


    total_exp_md =    ((exp_md1) + (exp_md2) + (exp_md3) + (exp_md4)
                     + (exp_md5) + (exp_md6) + (exp_md7) + (exp_md8) + (exp_md9)
                     + (exp_md10) + (exp_md11) + (exp_md12) + (exp_md13) + (exp_md14)
                     + (exp_md15) + (exp_md16) + (exp_md17) + (exp_md18) + (exp_md19)
                    + (exp_md20) + (exp_md21) + (exp_md22) + (exp_md23) + (exp_md24)
                    + (exp_md25) + (exp_md26) + (exp_md27) + (exp_md28) + (exp_md29)
                    + (exp_md30) + (exp_md31)).toFixed(2)




    // **********************************************************
    //************* CALCULATE RICE CONSUMPTION **********
    //******************************************************** */
    let rice_d1 = (((meals_p1*100) + (meals_m1*150))/1000).toFixed(3);
    let rice_d2 = (((meals_p2*100) + (meals_m2*150))/1000).toFixed(3);
    let rice_d3 = (((meals_p3*100) + (meals_m3*150))/1000).toFixed(3);
    let rice_d4 = (((meals_p4*100) + (meals_m4*150))/1000).toFixed(3);
    let rice_d5 = (((meals_p5*100) + (meals_m5*150))/1000).toFixed(3);
    let rice_d6 = (((meals_p6*100) + (meals_m6*150))/1000).toFixed(3);
    let rice_d7 = (((meals_p7*100) + (meals_m7*150))/1000).toFixed(3);
    let rice_d8 = (((meals_p8*100) + (meals_m8*150))/1000).toFixed(3);
    let rice_d9 = (((meals_p9*100) + (meals_m9*150))/1000).toFixed(3);
    let rice_d10 = (((meals_p10*100) + (meals_m10*150))/1000).toFixed(3);
    let rice_d11 = (((meals_p11*100) + (meals_m11*150))/1000).toFixed(3);
    let rice_d12 = (((meals_p12*100) + (meals_m12*150))/1000).toFixed(3);
    let rice_d13 = (((meals_p13*100) + (meals_m13*150))/1000).toFixed(3);
    let rice_d14 = (((meals_p14*100) + (meals_m14*150))/1000).toFixed(3);
    let rice_d15 = (((meals_p15*100) + (meals_m15*150))/1000).toFixed(3);
    let rice_d16 = (((meals_p16*100) + (meals_m16*150))/1000).toFixed(3);
    let rice_d17 = (((meals_p17*100) + (meals_m17*150))/1000).toFixed(3);
    let rice_d18 = (((meals_p18*100) + (meals_m18*150))/1000).toFixed(3);
    let rice_d19 = (((meals_p19*100) + (meals_m19*150))/1000).toFixed(3);
    let rice_d20 = (((meals_p20*100) + (meals_m20*150))/1000).toFixed(3);
    let rice_d21 = (((meals_p21*100) + (meals_m21*150))/1000).toFixed(3);
    let rice_d22 = (((meals_p22*100) + (meals_m22*150))/1000).toFixed(3);
    let rice_d23 = (((meals_p23*100) + (meals_m23*150))/1000).toFixed(3);
    let rice_d24 = (((meals_p24*100) + (meals_m24*150))/1000).toFixed(3);
    let rice_d25 = (((meals_p25*100) + (meals_m25*150))/1000).toFixed(3);
    let rice_d26 = (((meals_p26*100) + (meals_m26*150))/1000).toFixed(3);
    let rice_d27 = (((meals_p27*100) + (meals_m27*150))/1000).toFixed(3);
    let rice_d28 = (((meals_p28*100) + (meals_m28*150))/1000).toFixed(3);
    let rice_d29 = (((meals_p29*100) + (meals_m29*150))/1000).toFixed(3);
    let rice_d30 = (((meals_p30*100) + (meals_m30*150))/1000).toFixed(3);
    let rice_d31 = (((meals_p31*100) + (meals_m31*150))/1000).toFixed(3);


    // **********************************************************
    //************* CASHBOOK CALCULATION **********
    //******************************************************** */

    let prTotal = (+(pr_bf)  +  +(pr_income)).toFixed(2);
    let mdTotal = (+(md_bf)  +  +(md_income)).toFixed(2);

    //primary balance (total income received for the month - Expenditure)

    let prBalance = prTotal -  total_exp_pr;
    let mdBalance = (mdTotal -  total_exp_md).toFixed(2);



    // **********************************************************
    //************* SAVE TO LOCAL STORAGE **********
    //******************************************************** */

    localStorage.setItem("school", school);
     localStorage.setItem("month", month);
     localStorage.setItem("year", year);

    localStorage.setItem("meals_p1", meals_p1)
    localStorage.setItem("meals_m1", meals_m1)
    localStorage.setItem("rice_d1", rice_d1);
    localStorage.setItem("exp_d1", exp_d1);

    localStorage.setItem("meals_p2", meals_p2)
    localStorage.setItem("meals_m2", meals_m2)
    localStorage.setItem("rice_d2", rice_d2);
    localStorage.setItem("exp_d2", exp_d2);

    localStorage.setItem("meals_p3", meals_p3)
    localStorage.setItem("meals_m3", meals_m3)
    localStorage.setItem("rice_d3", rice_d3);
    localStorage.setItem("exp_d3", exp_d3);

    localStorage.setItem("meals_p4", meals_p4)
    localStorage.setItem("meals_m4", meals_m4)
    localStorage.setItem("rice_d4", rice_d4);
    localStorage.setItem("exp_d4", exp_d4);

    localStorage.setItem("meals_p5", meals_p5)
    localStorage.setItem("meals_m5", meals_m5)
    localStorage.setItem("rice_d5", rice_d5);
    localStorage.setItem("exp_d5", exp_d5);

    localStorage.setItem("meals_p6", meals_p6)
    localStorage.setItem("meals_m6", meals_m6)
    localStorage.setItem("rice_d6", rice_d6);
    localStorage.setItem("exp_d6", exp_d6);

    localStorage.setItem("meals_p7", meals_p7)
    localStorage.setItem("meals_m7", meals_m7)
    localStorage.setItem("rice_d7", rice_d7);
    localStorage.setItem("exp_d7", exp_d7);

    localStorage.setItem("meals_p8", meals_p8)
    localStorage.setItem("meals_m8", meals_m8)
    localStorage.setItem("rice_d8", rice_d8);
    localStorage.setItem("exp_d8", exp_d8);

    localStorage.setItem("meals_p9", meals_p9)
    localStorage.setItem("meals_m9", meals_m9)
    localStorage.setItem("rice_d9", rice_d9);
    localStorage.setItem("exp_d9", exp_d9);

    localStorage.setItem("meals_p10", meals_p10)
    localStorage.setItem("meals_m10", meals_m10)
    localStorage.setItem("rice_d10", rice_d10);
    localStorage.setItem("exp_d10", exp_d10);

    localStorage.setItem("meals_p11", meals_p11)
    localStorage.setItem("meals_m11", meals_m11)
    localStorage.setItem("rice_d11", rice_d11);
    localStorage.setItem("exp_d11", exp_d11);

    localStorage.setItem("meals_p12", meals_p12)
    localStorage.setItem("meals_m12", meals_m12)
    localStorage.setItem("rice_d12", rice_d12);
    localStorage.setItem("exp_d12", exp_d12);

    localStorage.setItem("meals_p13", meals_p13)
    localStorage.setItem("meals_m13", meals_m13)
    localStorage.setItem("rice_d13", rice_d13);
    localStorage.setItem("exp_d13", exp_d13);

    localStorage.setItem("meals_p14", meals_p14)
    localStorage.setItem("meals_m14", meals_m14)
    localStorage.setItem("rice_d14", rice_d14);
    localStorage.setItem("exp_d14", exp_d14);

    localStorage.setItem("meals_p15", meals_p15)
    localStorage.setItem("meals_m15", meals_m15)
    localStorage.setItem("rice_d15", rice_d15);
    localStorage.setItem("exp_d15", exp_d15);

    localStorage.setItem("meals_p16", meals_p16)
    localStorage.setItem("meals_m16", meals_m16)
    localStorage.setItem("rice_d16", rice_d16);
    localStorage.setItem("exp_d16", exp_d16);

    localStorage.setItem("meals_p17", meals_p17)
    localStorage.setItem("meals_m17", meals_m17)
    localStorage.setItem("rice_d17", rice_d17);
    localStorage.setItem("exp_d17", exp_d17);

    localStorage.setItem("meals_p18", meals_p18)
    localStorage.setItem("meals_m18", meals_m18)
    localStorage.setItem("rice_d18", rice_d18);
    localStorage.setItem("exp_d18", exp_d18);


    localStorage.setItem("meals_p19", meals_p19)
    localStorage.setItem("meals_m19", meals_m19)
    localStorage.setItem("rice_d19", rice_d19);
    localStorage.setItem("exp_d19", exp_d19);


    localStorage.setItem("meals_p20", meals_p20)
    localStorage.setItem("meals_m20", meals_m20)
    localStorage.setItem("rice_d20", rice_d20);
    localStorage.setItem("exp_d20", exp_d20);


    localStorage.setItem("meals_p21", meals_p21)
    localStorage.setItem("meals_m21", meals_m21)
    localStorage.setItem("rice_d21", rice_d21);
    localStorage.setItem("exp_d21", exp_d21);

    localStorage.setItem("meals_p22", meals_p22)
    localStorage.setItem("meals_m22", meals_m22)
    localStorage.setItem("rice_d22", rice_d22);
    localStorage.setItem("exp_d22", exp_d22);

    localStorage.setItem("meals_p23", meals_p23)
    localStorage.setItem("meals_m23", meals_m23)
    localStorage.setItem("rice_d23", rice_d23);
    localStorage.setItem("exp_d23", exp_d23);

    localStorage.setItem("meals_p24", meals_p24)
    localStorage.setItem("meals_m24", meals_m24)
    localStorage.setItem("rice_d24", rice_d24);
    localStorage.setItem("exp_d24", exp_d24);

    localStorage.setItem("meals_p25", meals_p25)
    localStorage.setItem("meals_m25", meals_m14)
    localStorage.setItem("rice_d25", rice_d25);
    localStorage.setItem("exp_d25", exp_d25);

    localStorage.setItem("meals_p26", meals_p26)
    localStorage.setItem("meals_m26", meals_m26)
    localStorage.setItem("rice_d26", rice_d26);
    localStorage.setItem("exp_d26", exp_d26);

    localStorage.setItem("meals_p27", meals_p27)
    localStorage.setItem("meals_m27", meals_m27)
    localStorage.setItem("rice_d27", rice_d27);
    localStorage.setItem("exp_d27", exp_d27);

    localStorage.setItem("meals_p28", meals_p28)
    localStorage.setItem("meals_m28", meals_m28)
    localStorage.setItem("rice_d28", rice_d28);
    localStorage.setItem("exp_d28", exp_d28);

    localStorage.setItem("meals_p29", meals_p29)
    localStorage.setItem("meals_m29", meals_m29)
    localStorage.setItem("rice_d29", rice_d29);
    localStorage.setItem("exp_d29", exp_d29);


    localStorage.setItem("meals_p30", meals_p30)
    localStorage.setItem("meals_m30", meals_m30)
    localStorage.setItem("rice_d30", rice_d30);
    localStorage.setItem("exp_d30", exp_d30);


    localStorage.setItem("meals_p31", meals_p31)
    localStorage.setItem("meals_m31", meals_m31)
    localStorage.setItem("rice_d31", rice_d31);
    localStorage.setItem("exp_d31", exp_d31);

    // CashBook

    localStorage.setItem("prTotal", prTotal);
    localStorage.setItem("mdTotal", mdTotal);

    localStorage.setItem("total_exp_pr", total_exp_pr);
    localStorage.setItem("total_exp_md", total_exp_md);

    localStorage.setItem("prBalance", prBalance);
    localStorage.setItem("mdBalance", mdBalance);








});


