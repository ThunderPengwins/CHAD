# CHAD
A website! Use it to make autonomouses and things. Programmed by Eric, with some help from Christine.

Url is https://ftcchad.com/

# First Time Instructions
For full instructions, go to the info page on the website or watch [this video](https://www.youtube.com/watch?v=Q_lo40TsDUI)

Okay, here we go
  1. Choose a chassis (click on it)
  2. Name your autonomous - important
  3. Choose your CPI present, usually based on motor gear ratio but sometimes with custom stuff (google the terms) - also important
  4. Enter the dimensions of your robot - not super important (yet)
  5. Pick a starting position
  - a. choose one of the tapes
  - b. move your cursor over the field and then click to confirm rotation
  - c. move your cursor across the field and click to confirm x position
  6. Use the different step types to build an autonomous
  - a. Move your cursor over the field and click to confirm values or
  - b. enter custom values in the input fields
  - c. click done to confirm the step
  - d. click the trash can to delete a step and the X to delete all steps
  7. Click generate
  8. Click copy to clipboard
  9. Make a new class in the ftc app and call it your autonomous name (case sensitive)
  10. Select all and paste the code (replace all the code with what's in your clipboard)
  11. Go back to the website and copy the calibrate code and make a new class called "Calibrate" and put the code in there
  12. Calibrate your robot (details below)
  13. Done!
It seems like a lot, but I tried it once and did an entire autonomous in 1.5 minutes!

# Second Time Instructions (same chassis)
This doesn't really deserve it's own section, but just do everything the same as above except two things:
  1. Enter the bias you got from calibration
  2. Don't both downloading the calibration code and recalibrating

# Calibration Instructions
So, CHAD's defaults should be pretty close from the get go, but it's still good to calibrate. Just keep in mind if you're getting a bias of more than 2 or less than 0.3 you probably have an issue with your CPI numbers.
  1. Set a tape measure next to your robot and run the Calibrate autonomous program
  2. Meause how far it went
  3. Calculate your new bias using the formula:  (20 / distance) * old bias
  4. Replace the bias in all programs using CHAD (for the chassis that you calibrated)
  5. If you make major changes to the robot like adding a lot of weight or changing the center of balance you should recalibrate
Also, if your autonomous starts acting weird and you haven't changed the robot, it's good to troubleshoot before recalibrating

# Troubleshooting
### My robot is turning while moving
You have a disconnected encoder, which means either it's broken or a wire is broken or a wire is disconnected.

### My robot turns a little more or less than it should
Your range needs to be changed.

In the `turnWithGyro` function, there should be lines the following lines:

```java
Double firsta = convertify(first - 5);//175
Double firstb = convertify(first + 5);//-175
```

and
      
```java
Double seconda = convertify(second - 5);//175
Double secondb = convertify(second + 5);//-175
```

The -5 and +5 you see are creating your turning range, which means the robot will stop once it's anywhere in that range. The default is 5 degrees more and less than your target. However, you can change this to whatever you wish. Just remember to change the numbers in all programs as CHAD functions are all independent.

### My robot turns a lot more or less than it should
Either you've got a wrong input or your Gyro is broken. Since the IMU throws an error on initializing when it's configured incorrectly, if the inputs are correct then it's just broken. Test it a few more ways and then replace your hub.

### I get an error when starting a CHAD program that says something about the IMU
You've probably got a wrong configuration. Try to run the program regardless, and if it works ignore the error. If it doesn't, make sure you've configure your IMU in an I2C port as "imu" Sometimes there's a number after it by default, so look out for that.

### I get an error in my IDE (Android Studio or onbot) when I put CHAD programs in a folder
By default, CHAD files cannot be put in folders past the normal spot, but this can be changed.
The issue comes from this line:

```java
package org.firstinspires.ftc.teamcode;
```
This line specifies where the code is located. If you want to put a CHAD program in a folder, add dot and the name of your folder. For instance, if you have a folder named trash, the line should say:

```java
package org.firstinspires.ftc.teamcode.trash;
```

Most other issues come down to configuration, wiring, CPI numbers, and hardware initialization, which cannot possibly be covered in every aspect (and which will have to be dealt with in programs not using CHAD as well).

If you have questions or find any bugs, please email us at thunderpengwinroboticsteam@gmail.com

Good luck!
