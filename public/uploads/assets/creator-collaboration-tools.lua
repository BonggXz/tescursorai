-- Creator Collaboration Tools
-- Simple in-game tracker for tasks.

local Collaboration = {}

function Collaboration.new()
	return {
		tasks = {},
	}
end

function Collaboration:addTask(task)
	table.insert(self.tasks, {
		text = task,
		completed = false,
	})
end

function Collaboration:completeTask(index)
	local entry = self.tasks[index]
	if entry then
		entry.completed = true
	end
end

return Collaboration
