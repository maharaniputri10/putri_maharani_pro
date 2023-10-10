const CreateComment = require('../CreateComments');

describe('CreateComment entities', () => {
    
    it('should throw error when payload did not contain needed property', () => {
        const payload = {content: 'Comment'};
        expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });
    
    
    it('should throw error when payload did not meet data type specification', () => {
        const payload = { threadId : 123, content : true, owner : 'dicoding' };
        expect(() => new CreateComment(payload)).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });


    it('should create CreateComment object correctly', () => {
        const payload = {threadId : '123', content : 'content', owner : 'dicoding'};
        const { threadId, content, owner } = new CreateComment(payload);
        expect(threadId).toEqual(payload.threadId);
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
    });
    
});
