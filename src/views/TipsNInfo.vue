<template>
<div class="bkgd">
    <div class="top">
        <img src="@/assets/Pictures/chadLogo.jpg" class="logo">
    </div>
    <div class="main">
        <v-expansion-panel class="panel">
            <v-expansion-panel-content>
                <template v-slot:header>
                    <div>General Use Guide</div>
                </template>
                <v-card>
                    <v-card-text>
                        <p class="c7">
                            <span class="c1">To use this website, simply follow these steps:</span>
                        </p>
                        <ol class="c3 lst-kix_eyoxed600bm5-0 start" start="1">
                            <li class="c0">
                                <span class="c6">Select a chassis</span>
                                <span class="c1">&nbsp;on the home page. More information about the chassis is listed in a section below.</span>
                            </li>
                            <li class="c0">
                                <span class="c6">Go to the creator page</span>
                                <span class="c1">&nbsp;using the bottom navigation and make sure it displays the chassis you have chosen.</span>
                            </li>
                            <li class="c0">
                                <span class="c6">Enter a name</span>
                                <span class="c1">&nbsp;for your autonomous program. Try and enter a new name for every autonomous you start.</span>
                            </li>
                            <li class="c0">
                                <span>In the CPI Presets box, </span>
                                <span class="c6">choose the number that matches your motor’s gear ratio.</span>
                                <span>&nbsp;If you do not see your number, you have 3rd party encoders, your wheels have an atypical diameter, </span>
                                <span>or you</span>
                                <span class="c1">&nbsp;are using an external gear box, select “custom.”</span>
                            </li>
                        </ol>
                        <ol class="c3 lst-kix_eyoxed600bm5-1 start" start="1">
                            <li class="c4">
                                <span class="c2">In custom, you will be asked for a CPR, gear ratio, and diameter</span>
                            </li>
                            <li class="c4">
                                <span class="c2">CPR is counts per rotation. The standard for this is 28, but it’s always good to look up your encoder’s CPR if you’re not sure.</span>
                            </li>
                            <li class="c4">
                                <span class="c2">When entering the gear ratio, be sure to take into account both the internal and external gear boxes, and whether they are increasing speed or torque.</span>
                            </li>
                            <li class="c4">
                                <span class="c2">When measuring the diameter, do so from the center of the rim of wheel.</span>
                            </li>
                        </ol>
                        <ol class="c3 lst-kix_eyoxed600bm5-0" start="5">
                            <li class="c0">
                                <span class="c6">Select a starting position</span>
                                <span class="c1">&nbsp;for your autonomous. While this does not directly affect your generated autonomous code, it will help us visual the process on the field.</span>
                            </li>
                            <li class="c0">
                                <span>Generally, you will leave the </span>
                                <span class="c6">movement bias</span>
                                <span class="c1">&nbsp;at the default of one, but if you have used CHAD before and know there are adjustments that need to be made, feel free to enter in a decimal or integer that will be multiplied against the encoder counts to counteract friction or other extraneous influences.</span>
                            </li>
                            <li class="c0">
                                <span class="c6">Select the type of your first step.</span>
                                <span class="c1">&nbsp;Depending on what chassis you have chosen, you will be given the option of Drive, Turn, and Arc or Strafe.</span>
                            </li>
                        </ol>
                        <ol class="c3 lst-kix_eyoxed600bm5-1 start" start="1">
                            <li class="c4">
                                <span class="c5">Drive </span>
                                <span class="c2">is simply moving forwards and backwards (using the encoders).</span>
                            </li>
                            <li class="c4">
                                <span class="c5">Turning </span>
                                <span class="c2">is simply turning (using a gyro, IMU by default). Details on changing default hardware devices is below, in the section “Adjusting Generated Code.”</span>
                            </li>
                            <li class="c4">
                                <span class="c5">Arcing </span>
                                <span class="c2">is a special function which allows you to move and turn at the same time. Details on the inputs for Arcing is below, in step 8 and the section “About Arcing.”</span>
                            </li>
                            <li class="c4">
                                <span class="c5">Strafing </span>
                                <span class="c2">is moving side to side or in diagonals. Details on the inputs for Strafing is below, in step 8.</span>
                            </li>
                        </ol>
                        <ol class="c3 lst-kix_eyoxed600bm5-0" start="8">
                            <li class="c0">
                                <span class="c6">Enter the proper inputs</span>
                                <span class="c1">&nbsp;for the step you’ve chosen. Distance, Angle, and Speed are all numbers only inputs. You can also place your cursor over the field to automatically enter inputs with correct syntax. In order to start or stop detecting new cursor locations, simply click on the field.</span>
                            </li>
                        </ol>
                        <ol class="c3 lst-kix_eyoxed600bm5-1 start" start="1">
                            <li class="c4">
                                <span class="c5">Direction </span>
                                <span class="c2">should have string inputs like “left,” “right,” forward right,” or “back left.” The website will notify you if you complete a step with improper spelling or word order.</span>
                            </li>
                            <li class="c4">
                                <span class="c8">During arcing, the </span>
                                <span class="c5">angle </span>
                                <span class="c8">you enter will specify the amount the robot turns while it is moving, while the </span>
                                <span class="c5">distance </span>
                                <span class="c2">specifies the length away from the starting position it will be. A visual representation of this movement will appear automatically on the field when you enter the proper inputs.</span>
                            </li>
                            <li class="c4">
                                <span class="c5">Angle </span>
                                <span class="c8">has a minimum value of -360° and maximum value of 360°. </span>
                                <span class="c5">Speed </span>
                                <span class="c2">has a minimum value of -1 and a maximum value of 1.</span>
                            </li>
                        </ol>
                        <ol class="c3 lst-kix_eyoxed600bm5-0" start="9">
                            <li class="c0">
                                <span>When you are satisfied with the step, </span>
                                <span class="c6">click done</span>
                                <span class="c1">&nbsp;and the step will appear on the right hand side in the steps list, and the visual representation will change color on the field.</span>
                            </li>
                            <li class="c0">
                                <span class="c6">Repeat steps 7-9</span>
                                <span class="c1">&nbsp;until you have finished your autonomous.</span>
                            </li>
                            <li class="c0">
                                <span class="c6">Click the large generate button</span>
                                <span class="c1">&nbsp;on the bottom of the page. This should open a new section in the bottom navigation. The code will appear on the screen, and a .txt download will be available. The generated code will be available until you click restart on the Creator page or change chassis on the homepage.</span>
                            </li>
                        </ol>
                        <p class="c7">
                            <span class="c6">IMPORTANT: Refreshing the page, changing chassis or restarting your autonomous will permanently delete your autonomous design.</span>
                        </p>
                    </v-card-text>
                </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content>
                <template v-slot:header>
                    <div>Balloon facts<!--<img src="https://www.dollartree.com/ccstore/v1/images/?source=/file/v8200564444066591050/products/174788.jpg&height=475&width=475" class="balloon"/>--></div>
                </template>
                <v-card>
                    <v-card-text>I am a Balloon</v-card-text>
                </v-card>
            </v-expansion-panel-content>
            <v-expansion-panel-content>
                <template v-slot:header>
                    <div class="head">General Use Guide</div>
                </template>
                <v-card>
                    <v-card-text>
                        To use this website, simply follow these steps:
                        <ol type="1">
                            <li><strong>Select</strong> a chassis on the home page. More information about the chassis is listed in a section below.</li>
                            <li><strong>Go to the creator page</strong> using the bottom navigation and make sure it displays the chassis you have chosen.</li>
                            <li><strong>Enter a name</strong> for your autonomous program. Try and enter a new name for every autonomous you start.</li>
                            <li>In the CPI Presets box, <strong>choose the number that matches your motor’s gear ratio.</strong> If you do not see your number, you have 3rd party encoders, your wheels have an atypical diameter, or you are using an external gear box, select “custom.”</li>
                            <ol type="a">
                                <li>In custom, you will be asked for a CPR, gear ratio, and diameter</li>
                                <li>CPR is counts per rotation. The standard for this is 28, but it’s always good to look up your encoder’s CPR if you’re not sure.</li>
                                <li>When entering the gear ratio, be sure to take into account both the internal and external gear boxes, and whether they are increasing speed or torque.</li>
                                <li>When measuring the diameter, do so from the center of the rim of wheel.</li>
                            </ol>
                            <li><strong>Select a starting position</strong> for your autonomous. While this does not directly affect your generated autonomous code, it will help us visual the process on the field.</li>
                            <li>Generally, you will leave the <strong>movement bias</strong> at the default of one, but if you have used CHAD before and know there are adjustments that need to be made, feel free to enter in a decimal or integer that will be multiplied against the encoder counts to counteract friction or other extraneous influences.</li>
                            <li><strong>Select the type of your first step.</strong> Depending on what chassis you have chosen, you will be given the option of Drive, Turn, and Arc or Strafe.</li>
                            <ol type="a">
                                <li><strong>Drive</strong> is simply moving forwards and backwards (using the encoders).</li>
                                <li><strong>Turning</strong> is simply turning (using a gyro, IMU by default). Details on changing default hardware devices is below, in the section “Adjusting Generated Code.”</li>
                                <li><strong>Arcing</strong> is a special function which allows you to move and turn at the same time. Details on the inputs for Arcing is below, in step 8 and the section “About Arcing.”</li>
                                <li><strong>Strafing</strong> is moving side to side or in diagonals. Details on the inputs for Strafing is below, in step 8.</li>
                            </ol>
                            <li><strong>Enter the proper inputs</strong> for the step you’ve chosen. Distance, Angle, and Speed are all numbers only inputs. You can also place your cursor over the field to automatically enter inputs with correct syntax. In order to start or stop detecting new cursor locations, simply click on the field.</li>
                            <ol type="a">
                                <li><Strong>Direction</strong> should have string inputs like “left,” “right,” forward right,” or “back left.” The website will notify you if you complete a step with improper spelling or word order.</li>
                                <li>During arcing, the <Strong>angle</strong> you enter will specify the amount the robot turns while it is moving, while the <Strong>distance</strong> specifies the length away from the starting position it will be. A visual representation of this movement will appear automatically on the field when you enter the proper inputs.</li>
                                <li><strong>Angle</strong> has a minimum value of -360° and maximum value of 360°. Speed has a minimum value of -1 and a maximum value of 1.</li>
                            </ol>
                            <li>When you are satisfied with the step, <strong>click done</strong> and the step will appear on the right hand side in the steps list, and the visual representation will change color on the field.</li>
                            <li><strong>Repeat steps 7-9</strong> until you have finished your autonomous.</li>
                            <li><strong>Click the large generate button</strong> on the bottom of the page. This should open a new section in the bottom navigation. The code will appear on the screen, and a .txt download will be available. The generated code will be available until you click restart on the Creator page or change chassis on the homepage.</li>
                        </ol>
                        IMPORTANT: Refreshing the page, changing chassis or restarting your autonomous will permanently delete your autonomous design.
                    </v-card-text>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </div>
    <!--<script id="dsq-count-scr" src="//chad-2.disqus.com/count.js" async></script>-->
</div>
</template>

<script>
var disqus_config = function () {
this.page.url = ftcchad.com;  // Replace PAGE_URL with your page's canonical URL variable
this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};

(function() { // DON'T EDIT BELOW THIS LINE
var d = document, s = d.createElement('script');
s.src = 'https://EXAMPLE.disqus.com/embed.js';
s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();

export default {
    name: "TipsNInfo",
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Didact+Gothic');

.head{
	font-family:'Century Gothic','Futura','Didact Gothic',san-serif;
    font-weight: 700;
}

li{
    font-family: "Montserrat", sans-serif;
}

#top{
    height: 5%;
    width: 100%;
    top: 0%;
    position: absolute;
}

#logo{
    width: 10%;
}

#bkgd{
    margin: 0%;
    overflow: auto;
}

.main{
    width: 94%;
    margin: 3%;
    height: 91%;
    top: 5%;
    position: absolute;
    border-radius: 5px;
    overflow: auto;
    scroll-behavior: auto;
    margin-bottom: 10%;
}

.panel{
    border-radius: 5px;
    scroll-behavior: auto;
}

.balloon{
    width: 10%;
}

</style>
