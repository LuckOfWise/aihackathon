class CreateItems < ActiveRecord::Migration[8.1]
  def change
    create_table :items do |t|
      t.string :title, null: false, default: ''
      t.text :body, null: false, default: ''
      t.string :status, null: false, default: 'draft', comment: 'draft/published/archived'

      t.timestamps
    end

    add_index :items, :status
    add_index :items, :created_at
  end
end
