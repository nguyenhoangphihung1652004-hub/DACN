<?php
class Card
{
    private $conn;
    private $table_name = "cards";

    public $id;
    public $deck_id;
    public $front_content;
    public $back_content;
    public $image_url;

    public $repetitions;
    public $ease_factor;
    public $review_interval;
    public $next_review_date;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function readByDeck($deck_id)
    {
        $query = "SELECT id, front_content, back_content, repetitions, ease_factor, review_interval, next_review_date
                  FROM " . $this->table_name . "
                  WHERE deck_id = :deck_id
                  ORDER BY id ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":deck_id", $deck_id);
        $stmt->execute();

        return $stmt;
    }

    public function create()
    {
        // Nếu chưa có ngày ôn tập, mặc định là hôm nay
        if (!$this->next_review_date) {
            $this->next_review_date = date('Y-m-d');
        }
        $query = "INSERT INTO " . $this->table_name . "
                  SET deck_id=:deck_id, front_content=:front_content, back_content=:back_content, next_review_date=:next_review_date";

        $stmt = $this->conn->prepare($query);

        $this->front_content = htmlspecialchars(strip_tags($this->front_content));
        $this->back_content = htmlspecialchars(strip_tags($this->back_content));

        $stmt->bindParam(":deck_id", $this->deck_id);
        $stmt->bindParam(":front_content", $this->front_content);
        $stmt->bindParam(":back_content", $this->back_content);
        $stmt->bindParam(":next_review_date", $this->next_review_date);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function updateSM2Progress()
    {
        $query = "UPDATE " . $this->table_name . "
                  SET repetitions = :repetitions, 
                      ease_factor = :ease_factor, 
                      review_interval = :review_interval, 
                      next_review_date = :next_review_date
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":repetitions", $this->repetitions);
        $stmt->bindParam(":ease_factor", $this->ease_factor);
        $stmt->bindParam(":review_interval", $this->review_interval);
        $stmt->bindParam(":next_review_date", $this->next_review_date);

        return $stmt->execute();
    }
}
