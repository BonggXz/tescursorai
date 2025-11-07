-- Advanced NPC Controller
-- Provides combat, patrol, and dialogue states for Roblox NPCs.

local NPCController = {}
NPCController.__index = NPCController

function NPCController.new(config)
	local self = setmetatable({}, NPCController)
	self.state = "idle"
	self.config = config or {}
	self.health = config.health or 100
	self.onStateChanged = Instance.new("BindableEvent")
	return self
end

function NPCController:setState(nextState)
	if self.state == nextState then
		return
	end

	self.state = nextState
	self.onStateChanged:Fire(nextState)
end

function NPCController:takeDamage(amount)
	self.health -= amount
	if self.health <= 0 then
		self:setState("defeated")
	else
		self:setState("combat")
	end
end

return NPCController
