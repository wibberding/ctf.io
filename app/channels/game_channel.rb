# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class GameChannel < ApplicationCable::Channel
  def subscribed
     stream_from "player_#{uuid}"
  end

  def unsubscribed
  	#when client disconnects, delete player.
  	Game.delete_user(uuid)
    #disconnect
  end

  def start_game (data)
    Game.start_game(uuid, data['name'])
  end

  def move_player (data)
  	Global.move_player(uuid, data['coords'])
  end

  def get_name
  	Game.get_name(uuid)
  end

  def get_self_uuid
  	Game.get_self_uuid(uuid)
  end

  def get_players
  	Game.get_players(uuid)
  end
end
