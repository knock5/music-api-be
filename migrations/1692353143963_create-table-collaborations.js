exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      notNull: true,
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'playlists(id)',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });

  // Menambahkan constraint unique untuk menghindari duplikasi data antara nilai keduanya
  pgm.addConstraint(
    'collaborations',
    'unique_playlist_id_and_user_id',
    'UNIQUE(playlist_id, user_id)',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
