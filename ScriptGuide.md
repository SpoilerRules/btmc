# Auto Gapple

**Modes**:
- "Packet": Utilizes the player ground packet to *increase* eating speed.
- "Old AAC": Utilizes game timer manipulation to *accelerate* eating speed.
- "Off": Operates at the standard vanilla eating speed without any manipulation.

**Fast Consume Duration**: Specifies the wait duration before sending packets. Prior to meeting the required ticks, eating occurs at vanilla speed. This option is available exclusively in "Packet" mode.

**Packet Repeat**: Determines the quantity of player ground packets sent. Higher values correspond to increased eating speed. This option is exclusive to "Packet" mode.

**Old AAC Timer**: Adjusts the timer speed for "Old AAC" mode.

**Switch to Previous Slot** (upon reaching the target health): When enabled, the module will switch back to the previous item slot.
  - "Axe & Sword Only": Switches to the previous slot exclusively if the slot held previously contained a sword or axe.

**Required Health**: The health threshold triggering the auto gapple function.
**Target Health**: The health at which the auto gapple function ceases.

**Eat Delay (ms)**: The delay preceding consumption of the next gapple. Measured in milliseconds.

**Regeneration Check**: Prevents gapple consumption while regeneration effect is active.
**Absorption Check**: Prevents gapple consumption when absorption health is active.

**Toggle Aura**: Temporarily deactivates the "Kill Aura" module during gapple consumption to prevent invalid slot kicks. Reactivates when the target health is reached.

# Jump Criticals

**Modes**:
- "Jump": Performs a jump when making ground contact while attacking a valid entity.
- "Hop": Performs a hop when touching the ground and attacking a valid entity. This mode allows customizing the jump height.
- "Low Packet": Utilizes the minimum possible packet values for critical hits against your opponent.
- "BlocksMC": Bypassing packet criticals for the BlocksMC server. Specifically designed for Skywars & Bedwars with a 300 ms delay, tested as of August 24, 2023.
- "NCP": Does nothing.
- "Old Hypixel": Sends packets with values ranging between 0.01 and 0.06. Historically used to bypass Hypixel between 2018 and 2020.

**Settings not applicable to "Jump" & "Hop" modes**:
- "Delay": Introduces a delay before sending packets again.
- "Hurt Time": Temporarily suspends the module when the target entity reaches the specified hurt time.
- "Force No Move": Resets player motion in the X & Z directions to 0 during the module's critical hit attempt, overriding the "No Move Check" setting if enabled.
- "Force No Sprint:": Disables sprinting during the module's critical hit attempt, overriding the "Sprint Check" setting if enabled.
- "BlocksMC Warning": Generates a warning message every 5 seconds when mode is set to BlocksMC and the delay is set below 300 while connected to the BlocksMC server.

**Settings applicable to "Jump" & "Hop" modes**:
- "Sword & Axe Only": Activates the module exclusively when holding a sword or axe.
- "Aura Only": Triggers the module only when the aura is hitting a target.
- "No Move Check": Prevents the module's operation if the player is in motion.
- "Sprint Check": Prevents the module's operation if the player is sprinting.

**Exclusive to "Jump" and "Hop" modes**:
- "Hop Height": Defines the motion Y value for the "Hop" mode.
- "Smooth Camera": Disables updating of the player's motion Y in the client-side.
- "Landing Motion": Ineffective when set to 0. Adjusts the strength of the landing speed.
  - "Landing Motion Y": Specifies the required Y value to accelerate landing speed.
