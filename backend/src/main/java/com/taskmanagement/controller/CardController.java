package com.taskmanagement.controller;

import com.taskmanagement.entity.Card;
import com.taskmanagement.entity.TaskList;
import com.taskmanagement.repository.CardRepository;
import com.taskmanagement.repository.TaskListRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return ResponseEntity.ok(cardRepository.save(card));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        cardRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
