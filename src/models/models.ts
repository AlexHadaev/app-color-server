import {Column, DataType, ForeignKey, HasMany, Model, Table} from 'sequelize-typescript';

@Table({
    tableName: "colors"
})
export class Color extends Model {

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    declare color: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare shadow: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare colorHEXA: string;

    @ForeignKey(() => Type)
    @Column
    declare typeId: number;

}

@Table({
    tableName: "types"
})

export class Type extends Model {
    // @PrimaryKey
    @HasMany(() => Color, 'typeId')
    colors!: Color[];

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    declare name: string;
}
