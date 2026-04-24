package com.taskmanagement.controller;

import com.taskmanagement.entity.TaskList;
import com.taskmanagement.repository.TaskListRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
public class TaskListController {

    private final TaskListRepository repository;

    public TaskListController(TaskListRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<TaskList> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public TaskList create(@RequestBody TaskList taskList) {
        return repository.save(taskList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
