exports.up = (pgm) => {
    pgm.createTable('threads', {
        id: {
            type: 'varchar(100)',
            primaryKey: true
        },
        title: {
            type: 'varchar(100)',
            notNull: true
        },
        body: {
            type: 'text',
            notNull: true
        },
        owner: {
            type: 'varchar(100)',
            notNull: true
        },
        date: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    });


    pgm.addConstraint('threads', 'fk_threads.owner_user.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};


exports.down = (pgm) => {
    pgm.dropConstraint('threads', 'fk_threads.owner_user.id');  
    pgm.dropTable('threads');
};
