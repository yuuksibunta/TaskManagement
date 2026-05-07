package com.taskmanagement.controller;

import com.taskmanagement.entity.Card;
import com.taskmanagement.entity.TaskList;
import com.taskmanagement.repository.CardRepository;
import com.taskmanagement.repository.TaskListRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    private final CardRepository cardRepository;
    private final TaskListRepository listRepository;

    public CardController(CardRepository cardRepository, TaskListRepository listRepository) {
        this.cardRepository = cardRepository;
        this.listRepository = listRepository;
    }

    @GetMapping
    public List<Card> getAll() {
        return cardRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        Long listId = Long.valueOf(body.get("listId").toString());
        TaskList taskList = listRepository.findById(listId).orElse(null);
        if (taskList == null) {
            return ResponseEntity.badRequest().body("List not found");
        }
        Card card = new Card();
        card.setTaskList(taskList);
        card.setTitle(body.get("title").toString());
        card.setMemo(body.containsKey("memo") ? body.get("memo").toString() : null);
        card.setPosition(Integer.valueOf(body.get("position").toString()));
        if (body.containsKey("dueDate") && body.get("dueDate") != null && !body.get("dueDate").toString().isEmpty())
            card.setDueDate(LocalDate.parse(body.get("dueDate").toString()));
        if (body.containsKey("priority") && body.get("priority") != null)
            card.setPriority(Integer.valueOf(body.get("priority").toString()));
        return ResponseEntity.ok(cardRepository.save(card));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Card card = cardRepository.findById(id).orElse(null);
        if (card == null) return ResponseEntity.notFound().build();

        if (body.containsKey("title"))
            card.setTitle(body.get("title").toString());
        if (body.containsKey("memo"))
            card.setMemo(body.get("memo") != null ? body.get("memo").toString() : null);
        if (body.containsKey("listId")) {
            Long listId = Long.valueOf(body.get("listId").toString());
            TaskList taskList = listRepository.findById(listId).orElse(null);
            if (taskList == null) return ResponseEntity.badRequest().body("List not found");
            card.setTaskList(taskList);
        }
        if (body.containsKey("position"))
            card.setPosition(Integer.valueOf(body.get("position").toString()));
        if (body.containsKey("dueDate"))
            card.setDueDate(body.get("dueDate") != null && !body.get("dueDate").toString().isEmpty()
                ? LocalDate.parse(body.get("dueDate").toString()) : null);
        if (body.containsKey("priority"))
            card.setPriority(body.get("priority") != null ? Integer.valueOf(body.get("priority").toString()) : null);

        return ResponseEntity.ok(cardRepository.save(card));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cardRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
