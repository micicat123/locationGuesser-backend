import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CommonModulesService {
    protected constructor(
        protected readonly repository: Repository<any>
    ){} 

    async create(data:any): Promise<any> {
        return await this.repository.save(data);
    }

    async findBy(data: any): Promise<any>{
        return await this.repository.findOne({where: data});
    }

    async all(): Promise<any>{
        return this.repository.find();
    }

    async delete(id: any): Promise<any> {
        return this.repository.delete(id);
    }
}
