-- Combat Ability Toolkit
-- Provides a simple ability registry with cooldown tracking.

local Toolkit = {}
Toolkit.__index = Toolkit

function Toolkit.new()
	return setmetatable({
		abilities = {},
		cooldowns = {},
	}, Toolkit)
end

function Toolkit:registerAbility(name, ability)
	self.abilities[name] = ability
end

function Toolkit:trigger(name, context)
	local ability = self.abilities[name]
	if not ability then
		return false
	end

	local cooldown = self.cooldowns[name]
	if cooldown and tick() < cooldown then
		return false
	end

	local duration = ability(context)
	if duration then
		self.cooldowns[name] = tick() + duration
	end

	return true
end

return Toolkit
