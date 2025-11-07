-- Procedural Lighting Kit
-- Handles day/night transitions and interior overrides.

local LightingKit = {}

function LightingKit.applyCycle(clockTime)
	local lighting = game:GetService("Lighting")
	lighting.ClockTime = clockTime
	if clockTime >= 18 or clockTime <= 6 then
		lighting.Brightness = 1.5
	else
		lighting.Brightness = 2.5
	end
end

return LightingKit
