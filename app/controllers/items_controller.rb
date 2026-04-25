class ItemsController < ApplicationController
  before_action :set_item, only: %i[show edit update destroy]

  def index
    @items = Item.default_order
  end

  def show
  end

  def new
    @item = Item.new
  end

  def edit
  end

  def create
    @item = Item.new(item_params)
    if @item.save
      redirect_to @item, notice: '作成しました'
    else
      render :new, status: :unprocessable_content
    end
  end

  def update
    if @item.update(item_params)
      redirect_to @item, notice: '更新しました'
    else
      render :edit, status: :unprocessable_content
    end
  end

  def destroy
    @item.destroy!
    redirect_to items_path, notice: '削除しました'
  end

  private

  def set_item
    @item = Item.find(params[:id])
  end

  def item_params
    params.require(:item).permit(:title, :body, :status, :image)
  end
end
